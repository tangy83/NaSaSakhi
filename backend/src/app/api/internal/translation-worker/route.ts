// POST /api/internal/translation-worker
// Processes PENDING_TRANSLATION jobs in batches — called by a cron scheduler.
// Secured by INTERNAL_API_KEY header to prevent public access.

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // seconds (Vercel Pro plan allows up to 300)

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

// Fields from Organization that should be translated
const ORG_TRANSLATABLE_FIELDS: Array<{ field: string; label: string }> = [
  { field: 'name', label: 'Organization Name' },
];

// Translate a single text string to a target language using Google Cloud Translation
async function translateText(
  text: string,
  targetLanguageCode: string
): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_TRANSLATE_API_KEY not configured');
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      target: targetLanguageCode,
      source: 'en',
      format: 'text',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Translate API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.data.translations[0].translatedText as string;
}

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
    return NextResponse.json({ success: true, data: { processed: 0, message: 'No pending jobs' } });
  }

  let processed = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      const translations: Array<{ fieldName: string; translatedText: string }> = [];

      // Translate each configured field
      for (const { field } of ORG_TRANSLATABLE_FIELDS) {
        const sourceText = (job.organization as any)[field];
        if (!sourceText || typeof sourceText !== 'string') continue;

        const translatedText = await translateText(sourceText, job.language.code);
        translations.push({ fieldName: field, translatedText });
      }

      // Persist translations and mark job as MACHINE_TRANSLATED in a transaction
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
      // Increment retryCount; mark TRANSLATION_FAILED after 3 retries
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
    data: { processed, failed, total: jobs.length },
  });
}
