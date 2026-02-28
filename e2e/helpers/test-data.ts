// Test data helpers — seed and clean up test users via direct API calls

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

/** Creates a test volunteer user via the internal seed API */
export async function createTestVolunteer(opts: {
  volunteerId: string;
  password: string;
  name?: string;
}): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/api/test/seed-volunteer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to seed test volunteer: ${res.status} ${text}`);
  }

  return res.json();
}

/** Deletes a test user by volunteerId */
export async function deleteTestVolunteer(volunteerId: string): Promise<void> {
  await fetch(`${BASE_URL}/api/test/seed-volunteer?volunteerId=${volunteerId}`, {
    method: 'DELETE',
  });
}

/** Creates a minimal PENDING organization via the internal seed API */
export async function createTestOrg(): Promise<{ id: string; name: string }> {
  const res = await fetch(`${BASE_URL}/api/test/seed-org`, {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to seed test org: ${res.status} ${text}`);
  }

  return res.json();
}

/** Deletes a test organization by orgId */
export async function deleteTestOrg(orgId: string): Promise<void> {
  await fetch(`${BASE_URL}/api/test/seed-org?orgId=${orgId}`, {
    method: 'DELETE',
  });
}
