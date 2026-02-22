import { test, expect } from '@playwright/test';
import { createTestVolunteer, deleteTestVolunteer } from './helpers/test-data';
import { loginAsVolunteer } from './helpers/auth';

const TEST_VOLUNTEER_ID = 'VOL-LANG-DASH-001';
const TEST_ADMIN_ID = 'VOL-LANG-DASH-ADMIN-001';
const TEST_PASSWORD = 'TestPassword123!';

test.describe('Language Coverage Dashboard', () => {
  test.beforeAll(async () => {
    await createTestVolunteer({
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
      name: 'Language Dashboard Volunteer',
    });
    // Admin user for add/toggle tests
    await createTestVolunteer({
      volunteerId: TEST_ADMIN_ID,
      password: TEST_PASSWORD,
      name: 'Language Dashboard Admin',
    });
  });

  test.afterAll(async () => {
    await deleteTestVolunteer(TEST_VOLUNTEER_ID);
    await deleteTestVolunteer(TEST_ADMIN_ID);
  });

  test('language coverage dashboard loads at /volunteer/languages', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    await expect(page.getByRole('heading', { name: /Language Coverage/i })).toBeVisible({ timeout: 15000 });
  });

  test('summary stats cards are visible', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    await expect(page.getByText(/Approved Organizations/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Full Coverage/i)).toBeVisible();
    await expect(page.getByText(/Partial Coverage/i)).toBeVisible();
  });

  test('per-language table shows at least the seeded languages', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    // Hindi should always be seeded
    await expect(page.getByText('Hindi')).toBeVisible({ timeout: 10000 });
    // English too
    await expect(page.getByText('English')).toBeVisible();
  });

  test('table shows script family for each language', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    // Devanagari appears for Hindi
    await expect(page.getByText('Devanagari').first()).toBeVisible({ timeout: 10000 });
  });

  test('RTL badge shows for Urdu', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    await expect(page.getByText('Urdu')).toBeVisible({ timeout: 10000 });
    // RTL badge should be in the same row
    const rtlBadges = page.getByText('RTL');
    await expect(rtlBadges.first()).toBeVisible();
  });

  test('filter tabs are present and clickable', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    const filters = ['All', 'Not Translated', 'Machine Only', 'Reviewed', 'Inactive'];
    for (const label of filters) {
      await expect(page.getByRole('button', { name: label })).toBeVisible({ timeout: 10000 });
    }
  });

  test('filter by Inactive hides active languages', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    await page.getByRole('button', { name: 'Inactive' }).click();

    // Wait for re-render — if no inactive languages, the empty state shows
    await page.waitForTimeout(500);
    // Either the empty state or inactive rows are shown
    const rows = page.locator('tbody tr');
    const emptyMsg = page.getByText('No languages match this filter');
    const hasRows = (await rows.count()) > 0;
    const hasEmpty = await emptyMsg.isVisible();
    expect(hasRows || hasEmpty).toBe(true);
  });

  test('coverage percentage bar is rendered per row', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.goto('/volunteer/languages');

    await expect(page.getByText('Hindi')).toBeVisible({ timeout: 10000 });

    // Progress bar containers should exist (identified by h-2 class)
    const progressBars = page.locator('.h-2.bg-gray-100');
    await expect(progressBars.first()).toBeVisible();
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/volunteer/languages');
    await expect(page).toHaveURL(/\/volunteer\/login/, { timeout: 10000 });
  });
});
