import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/dedup-resources
 * One-time cleanup: removes duplicate ServiceResource rows,
 * keeping the first (lowest id) for each (categoryId, name) pair.
 * Re-points BranchResource FK references to the kept row before deleting.
 */
export async function POST() {
  try {
    const allResources = await prisma.serviceResource.findMany({
      select: { id: true, categoryId: true, name: true },
      orderBy: { id: 'asc' },
    });

    const seen = new Map<string, string>(); // key → keeper id
    const duplicateIds: string[] = [];
    const keeperByDup = new Map<string, string>(); // dup id → keeper id

    for (const r of allResources) {
      const key = `${r.categoryId}|${r.name}`;
      if (!seen.has(key)) {
        seen.set(key, r.id);
      } else {
        duplicateIds.push(r.id);
        keeperByDup.set(r.id, seen.get(key)!);
      }
    }

    if (duplicateIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No duplicates found.',
        deleted: 0,
        unique: seen.size,
      });
    }

    // Step 1: Re-point BranchResource rows that reference any duplicate
    // Group by keeper to batch the updates
    const keeperGroups = new Map<string, string[]>(); // keeper id → [dup ids]
    for (const [dupId, keeperId] of keeperByDup) {
      if (!keeperGroups.has(keeperId)) keeperGroups.set(keeperId, []);
      keeperGroups.get(keeperId)!.push(dupId);
    }

    for (const [keeperId, dupIds] of keeperGroups) {
      await prisma.branchResource.updateMany({
        where: { resourceId: { in: dupIds } },
        data: { resourceId: keeperId },
      });
    }

    // Step 2: Delete duplicates in batches of 200
    let deleted = 0;
    const batchSize = 200;
    for (let i = 0; i < duplicateIds.length; i += batchSize) {
      const batch = duplicateIds.slice(i, i + batchSize);
      const result = await prisma.serviceResource.deleteMany({
        where: { id: { in: batch } },
      });
      deleted += result.count;
    }

    return NextResponse.json({
      success: true,
      message: `Removed ${deleted} duplicate resources. ${seen.size} unique resources remain.`,
      deleted,
      unique: seen.size,
    });
  } catch (error) {
    console.error('Dedup error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
