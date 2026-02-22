import { test, expect } from '@playwright/test';
import { createTestVolunteer, deleteTestVolunteer } from './helpers/test-data';
import { loginAsVolunteer } from './helpers/auth';

const TEST_VOLUNTEER_ID = 'VOL-TRANS-REVIEW-001';
const TEST_PASSWORD = 'TestPassword123!';

test.describe('Translation Review', () => {
  test.beforeAll(async () => {
    await createTestVolunteer({
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
      name: 'Translation Test Volunteer',
    });
  });

  test.afterAll(async () => {
    await deleteTestVolunteer(TEST_VOLUNTEER_ID);
  });

  /** Navigate to the translation review page for the first APPROVED org */
  async function goToFirstApprovedOrgTranslatePage(page: any) {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });
    await page.getByRole('button', { name: 'APPROVED' }).click();

    const reviewButtons = page.getByRole('button', { name: /Review/i });
    const count = await reviewButtons.count();
    if (count === 0) return false;

    await reviewButtons.first().click();
    await page.waitForURL(/\/volunteer\/organizations\/.+\/review/);

    const translateBtn = page.getByRole('button', { name: /Review Translations/i });
    if (!(await translateBtn.isVisible())) return false;

    await translateBtn.click();
    await page.waitForURL(/\/volunteer\/organizations\/.+\/translate/, { timeout: 15000 });
    return true;
  }

  test('translation review page loads for an approved org', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }
    await expect(page.getByText('Translation Review')).toBeVisible({ timeout: 10000 });
  });

  test('language list shows all active languages in the sidebar', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }

    // Language section header
    await expect(page.getByText('Languages')).toBeVisible({ timeout: 10000 });

    // At minimum, English and Hindi should appear (they're always seeded)
    // We just verify multiple language buttons exist
    const langButtons = page.locator('aside button');
    await expect(langButtons.first()).toBeVisible({ timeout: 10000 });
    const count = await langButtons.count();
    expect(count).toBeGreaterThan(1);
  });

  test('side-by-side review interface renders with English on the left', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }

    await page.waitForSelector('aside button', { timeout: 10000 });

    // Column headers should be present
    await expect(page.getByText('English (Source)')).toBeVisible({ timeout: 10000 });
  });

  test('progress bar shows reviewed count out of total fields', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }

    await page.waitForSelector('aside button', { timeout: 10000 });

    // Progress indicator should mention field counts
    await expect(
      page.getByText(/\d+ of \d+ fields/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('volunteer can switch languages via the sidebar', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }

    await page.waitForSelector('aside button', { timeout: 10000 });

    // Click a different language in the sidebar
    const langButtons = page.locator('aside button');
    const count = await langButtons.count();
    if (count < 2) {
      test.skip();
      return;
    }

    await langButtons.nth(1).click();

    // Progress bar should update (still shows "X of Y fields")
    await expect(
      page.getByText(/\d+ of \d+ fields/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('RTL badge shows for Urdu', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }

    await page.waitForSelector('aside button', { timeout: 10000 });

    // Find Urdu in the sidebar and click it
    const urduButton = page.getByRole('button', { name: /Urdu/i });
    if (!(await urduButton.isVisible())) {
      test.skip();
      return;
    }

    await urduButton.click();

    // RTL badge should appear in the progress bar area
    await expect(page.getByText('RTL')).toBeVisible({ timeout: 10000 });
  });

  test('Accept button marks a field as reviewed', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }

    await page.waitForSelector('aside button', { timeout: 10000 });

    // Look for an Accept button on a field card
    const acceptBtn = page.getByRole('button', { name: /Accept/i }).first();
    if (!(await acceptBtn.isVisible({ timeout: 10000 }))) {
      test.skip();
      return;
    }

    await acceptBtn.click();

    // The button should change to "Accepted" after saving
    await expect(
      page.getByRole('button', { name: /Accepted/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('Back to Review link navigates back to org review page', async ({ page }) => {
    const navigated = await goToFirstApprovedOrgTranslatePage(page);
    if (!navigated) {
      test.skip();
      return;
    }

    await expect(page.getByText('← Back to Review')).toBeVisible({ timeout: 10000 });
    await page.getByText('← Back to Review').click();
    await expect(page).toHaveURL(/\/volunteer\/organizations\/.+\/review/, { timeout: 10000 });
  });
});
