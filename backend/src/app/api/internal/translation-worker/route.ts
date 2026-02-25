// POST /api/internal/translation-worker
// Processes PENDING_TRANSLATION jobs in batches — called by a cron scheduler.
// Secured by INTERNAL_API_KEY header to prevent public access.
//
// Translation provider: Bhashini (bhashini.gov.in)
// Free government-backed API specifically for Indian languages.
// Docs: https://bhashini.gitbook.io/bhashini-apis

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // seconds (Vercel Pro plan allows up to 300)

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

// ─── Fields to translate ──────────────────────────────────────────────────────
const ORG_TRANSLATABLE_FIELDS: Array<{ field: string }> = [
  { field: 'name' },
];

// ─── Bhashini pipeline config cache ──────────────────────────────────────────
// Caches serviceId + endpoint + auth per language pair for 23 hours
// to avoid a config call on every translation request.
interface PipelineConfig {
  serviceId: string;
  callbackUrl: string;
  authHeader: string;   // full value for Authorization header
  expiresAt: number;
}

const pipelineConfigCache = new Map<string, PipelineConfig>();

const BHASHINI_PIPELINE_CONFIG_URL =
  'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
const BHASHINI_PIPELINE_ID = '64392f96daac500b55c543cd'; // MeitY

// Step 1: fetch (or return cached) pipeline config for a given target language
async function getBhashiniPipelineConfig(
  targetLanguageCode: string
): Promise<PipelineConfig> {
  const cacheKey = `en-${targetLanguageCode}`;
  const cached = pipelineConfigCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached;
  }

  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;

  if (!userId || !apiKey) {
    throw new Error('BHASHINI_USER_ID and BHASHINI_API_KEY must be configured');
  }

  const res = await fetch(BHASHINI_PIPELINE_CONFIG_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      userID: userId,
      ulcaApiKey: apiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: 'translation',
          config: {
            language: {
              sourceLanguage: 'en',
              targetLanguage: targetLanguageCode,
            },
          },
        },
      ],
      pipelineRequestConfig: {
        pipelineId: BHASHINI_PIPELINE_ID,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Bhashini pipeline config error ${res.status}: ${body}`);
  }

  const data = await res.json();

  const serviceId: string | undefined =
    data.pipelineResponseConfig?.[0]?.config?.serviceId;
  const endpoint = data.pipelineInferenceAPIEndPoint;
  const callbackUrl: string | undefined = endpoint?.callbackUrl;
  // Bhashini returns the full auth value (e.g. "Bearer <token>") in the response
  const authHeader: string | undefined = endpoint?.inferenceApiKey?.value;

  if (!serviceId || !callbackUrl || !authHeader) {
    throw new Error(
      `Bhashini pipeline config missing fields for lang=${targetLanguageCode}: ` +
        JSON.stringify({ serviceId, callbackUrl, hasAuth: !!authHeader })
    );
  }

  const config: PipelineConfig = {
    serviceId,
    callbackUrl,
    authHeader,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000, // 23 hours
  };

  pipelineConfigCache.set(cacheKey, config);
  return config;
}

// Step 2: translate a single string using the cached pipeline config
async function translateWithBhashini(
  text: string,
  targetLanguageCode: string
): Promise<string> {
  const { serviceId, callbackUrl, authHeader } =
    await getBhashiniPipelineConfig(targetLanguageCode);

  const res = await fetch(callbackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: 'translation',
          config: {
            language: {
              sourceLanguage: 'en',
              targetLanguage: targetLanguageCode,
            },
            serviceId,
          },
        },
      ],
      inputData: {
        input: [{ source: text }],
        audio: [{ audioContent: null }],
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Bhashini translate error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const translated: string | undefined =
    data.pipelineResponse?.[0]?.output?.[0]?.target;

  if (!translated) {
    throw new Error(
      `Bhashini returned unexpected response shape: ${JSON.stringify(data)}`
    );
  }

  return translated;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check — must supply the internal API key
  const authHeader = req.headers.get('Authorization');
  const internalKey = process.env.INTERNAL_API_KEY;

  if (!internalKey) {
    return NextResponse.json(
      { success: false, error: 'INTERNAL_API_KEY is not configured on the server' },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${internalKey}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = await getPrisma();

  // Fetch up to 20 pending jobs (oldest first)
  const jobs = await prisma.translationJob.findMany({
    where: { status: 'PENDING_TRANSLATION' },
    orderBy: { createdAt: 'asc' },
    take: 20,
    include: {
      organization: { select: { id: true, name: true } },
      language: { select: { id: true, code: true, name: true } },
    },
  });

  if (jobs.length === 0) {
    return NextResponse.json({
      success: true,
      data: { processed: 0, message: 'No pending jobs' },
    });
  }

  let processed = 0;
  let failed = 0;
  let skipped = 0;

  for (const job of jobs) {
    // Skip English → English (source language is already English)
    if (job.language.code === 'en') {
      await prisma.translationJob.update({
        where: { id: job.id },
        data: { status: 'MACHINE_TRANSLATED', errorMessage: null },
      });
      skipped++;
      continue;
    }

    try {
      const translations: Array<{ fieldName: string; translatedText: string }> = [];

      for (const { field } of ORG_TRANSLATABLE_FIELDS) {
        const sourceText = (job.organization as any)[field];
        if (!sourceText || typeof sourceText !== 'string') continue;

        const translatedText = await translateWithBhashini(
          sourceText,
          job.language.code
        );
        translations.push({ fieldName: field, translatedText });
      }

      // Persist translations and mark job MACHINE_TRANSLATED atomically
      await prisma.$transaction(async (tx) => {
        for (const { fieldName, translatedText } of translations) {
          await tx.organizationTranslation.upsert({
            where: {
              organizationId_languageId_fieldName: {
                organizationId: job.organizationId,
                languageId: job.languageId,
                fieldName,
              },
            },
            create: {
              organizationId: job.organizationId,
              languageId: job.languageId,
              fieldName,
              translatedText,
              status: 'MACHINE_TRANSLATED',
            },
            update: {
              translatedText,
              status: 'MACHINE_TRANSLATED',
            },
          });
        }

        await tx.translationJob.update({
          where: { id: job.id },
          data: { status: 'MACHINE_TRANSLATED', errorMessage: null },
        });
      });

      processed++;
    } catch (err: any) {
      // Retry up to 3 times; mark TRANSLATION_FAILED after that
      const newRetryCount = job.retryCount + 1;
      await prisma.translationJob.update({
        where: { id: job.id },
        data: {
          retryCount: newRetryCount,
          status: newRetryCount >= 3 ? 'TRANSLATION_FAILED' : 'PENDING_TRANSLATION',
          errorMessage: err.message ?? 'Unknown error',
        },
      });
      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    data: { processed, failed, skipped, total: jobs.length },
  });
}
