import { test, expect } from '@playwright/test';
import {
  createTestVolunteer,
  deleteTestVolunteer,
  createTestOrg,
  deleteTestOrg,
} from './helpers/test-data';
import { loginAsVolunteer } from './helpers/auth';

const TEST_VOLUNTEER_ID = 'VOL-QUEUE-TEST-001';
const TEST_PASSWORD = 'TestPassword123!';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

// Shared state across tests
let testOrgId: string;
let testOrgName: string;

test.describe.serial('Registration → Volunteer Queue Pipeline', () => {
  test.beforeAll(async () => {
    await createTestVolunteer({
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
      name: 'Queue Pipeline Test Volunteer',
    });
    const org = await createTestOrg();
    testOrgId = org.id;
    testOrgName = org.name;
  });

  test.afterAll(async () => {
    await deleteTestOrg(testOrgId);
    await deleteTestVolunteer(TEST_VOLUNTEER_ID);
  });

  // ─── API-level tests ──────────────────────────────────────────────────────

  test('POST /api/registration/submit with valid data returns success and organizationId', async ({
    request,
  }) => {
    // Fetch reference data first
    const [catRes, langRes, cityRes] = await Promise.all([
      request.get(`${BASE_URL}/api/reference/categories`),
      request.get(`${BASE_URL}/api/reference/languages`),
      request.get(`${BASE_URL}/api/reference/cities`),
    ]);

    const categories = (await catRes.json()).data as Array<{ id: string }>;
    const languages = (await langRes.json()).data as Array<{ id: string }>;
    const cities = (await cityRes.json()).data as Array<{ id: string; stateId: string }>;

    // Fetch resources for the first category
    const resourceRes = await request.get(
      `${BASE_URL}/api/reference/resources?categoryId=${categories[0].id}`
    );
    const resources = (await resourceRes.json()).data as Array<{ id: string }>;

    const timestamp = Date.now();
    const payload = {
      organizationName: `API Submit Test Org ${timestamp}`,
      registrationType: 'NGO',
      registrationNumber: `API-TEST-${timestamp}`,
      yearEstablished: 2020,
      primaryContact: {
        name: 'API Test Contact',
        email: `api-test-${timestamp}@test.internal`,
        phone: '9876543210',
      },
      categoryIds: [categories[0].id],
      resourceIds: resources.length > 0 ? [resources[0].id] : [],
      languageIds: [languages[0].id],
      branches: [
        {
          addressLine1: '456 API Test Road',
          cityId: cities[0].id,
          stateId: (cities[0] as any).stateId,
          pinCode: '560001',
        },
      ],
      registrationCertificateUrl: '/test/placeholder.pdf',
    };

    const response = await request.post(`${BASE_URL}/api/registration/submit`, {
      data: payload,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.organizationId).toBeTruthy();
    expect(typeof body.data.organizationId).toBe('string');

    // Clean up the org created by this test
    await deleteTestOrg(body.data.organizationId);
  });

  test('seeded org appears in GET /api/volunteer/organizations?status=PENDING', async ({
    page,
  }) => {
    // Login to get an authenticated session cookie
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Use the authenticated request context
    const response = await page
      .context()
      .request.get(`${BASE_URL}/api/volunteer/organizations?status=PENDING`);

    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.success).toBe(true);

    const orgs = body.data.organizations as Array<{ id: string; status: string }>;
    const seededOrg = orgs.find((o) => o.id === testOrgId);

    expect(seededOrg).toBeTruthy();
    expect(seededOrg?.status).toBe('PENDING');
  });

  test('seeded org is NOT returned when filtering by APPROVED', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const response = await page
      .context()
      .request.get(`${BASE_URL}/api/volunteer/organizations?status=APPROVED`);

    const body = await response.json();
    const orgs = body.data.organizations as Array<{ id: string }>;
    const seededOrg = orgs.find((o) => o.id === testOrgId);

    expect(seededOrg).toBeUndefined();
  });

  // ─── UI-level tests ──────────────────────────────────────────────────────

  test('volunteer dashboard shows seeded PENDING org in the queue table', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // The seeded org name should appear in the table
    await expect(page.getByText(testOrgName, { exact: false })).toBeVisible({ timeout: 10000 });
  });

  test('PENDING org row shows registration type and Review button', async ({
    page,
  }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Find the row containing the seeded org
    const orgRow = page.locator('tr', { hasText: testOrgName });
    await expect(orgRow).toBeVisible({ timeout: 10000 });

    // Registration type (NGO was set by seed-org) — shown in second column
    await expect(orgRow.getByText('NGO', { exact: false })).toBeVisible();

    // Review button is present in the row
    await expect(orgRow.getByRole('button', { name: /Review/i })).toBeVisible();
  });

  test('seeded PENDING org does NOT appear in APPROVED tab', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Switch to APPROVED tab and wait for the API response to complete
    const approvedResponsePromise = page.waitForResponse((resp) =>
      resp.url().includes('/api/volunteer/organizations') &&
      resp.url().includes('status=APPROVED')
    );
    await page.getByRole('button', { name: 'APPROVED' }).click();
    await approvedResponsePromise;

    // Org should not be visible in the APPROVED list
    await expect(page.getByText(testOrgName, { exact: false })).not.toBeVisible({ timeout: 5000 });
  });

  test('clicking Review navigates to org detail page', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Find the Review button in the seeded org's row
    const orgRow = page.locator('tr', { hasText: testOrgName });
    await expect(orgRow).toBeVisible({ timeout: 10000 });
    await orgRow.getByRole('button', { name: /Review/i }).click();

    await expect(page).toHaveURL(`/volunteer/organizations/${testOrgId}/review`, {
      timeout: 10000,
    });
  });

  test('org detail page shows all required sections', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto(`${BASE_URL}/volunteer/organizations/${testOrgId}/review`);

    await expect(page.getByText('Contact Information')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Branches/i)).toBeVisible();
    await expect(page.getByText('Languages')).toBeVisible();
    await expect(page.getByText('Documents')).toBeVisible();
  });

  test('org detail page shows Review Action panel with all action buttons', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto(`${BASE_URL}/volunteer/organizations/${testOrgId}/review`);

    await expect(page.getByText('Review Action')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Approve/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Request Clarification/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reject/i })).toBeVisible();
  });

  test('org detail page shows PENDING status for the seeded org', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto(`${BASE_URL}/volunteer/organizations/${testOrgId}/review`);

    // The status badge on the review page should show PENDING
    await expect(page.getByText('PENDING')).toBeVisible({ timeout: 10000 });
  });
});
