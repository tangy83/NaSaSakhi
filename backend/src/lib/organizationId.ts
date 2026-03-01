import { Prisma } from '@prisma/client';

type TransactionClient = Prisma.TransactionClient;

/**
 * Atomically generates the next organization custom ID.
 * Format: ORG00001, ORG00002, …, ORG99999 (5-digit zero-padded)
 * Must be called inside a Prisma transaction.
 */
export async function generateOrgCustomId(tx: TransactionClient): Promise<string> {
  // upsert ensures the counter row exists (handles fresh DBs without a seed run)
  // create: nextOrgNum=2 → first org gets ORG00001 (num = 2-1 = 1)
  // update: atomically increments the existing counter
  const counter = await tx.orgIdCounter.upsert({
    where: { id: 1 },
    update: { nextOrgNum: { increment: 1 } },
    create: { id: 1, nextOrgNum: 2 },
  });
  // nextOrgNum is now the post-operation value; use (value - 1) as the ID number
  const num = counter.nextOrgNum - 1;
  return `ORG${String(num).padStart(5, '0')}`;
}

/**
 * Generates the next branch custom ID for a given parent organization.
 * Format: BR00001a, BR00001b, …, BR00001z (parent's 5-digit num + letter suffix)
 * Must be called inside a Prisma transaction.
 * Supports up to 26 branches per organization (a–z).
 */
export async function generateBranchCustomId(
  tx: TransactionClient,
  parentCustomId: string
): Promise<string> {
  // Extract the numeric part from the parent ID, e.g. "ORG00121" → "00121"
  const numPart = parentCustomId.slice(3);

  const existingCount = await tx.organization.count({
    where: { parentOrganizationId: { not: null }, parentOrganization: { customId: parentCustomId } },
  });

  if (existingCount >= 26) {
    throw new Error(`Maximum 26 branches reached for organization ${parentCustomId}`);
  }

  const letter = String.fromCharCode(97 + existingCount); // 97 = 'a'
  return `BR${numPart}${letter}`;
}
