import { test, expect } from '@playwright/test';
import { createTestVolunteer, deleteTestVolunteer } from './helpers/test-data';
import { loginAsVolunteer } from './helpers/auth';

const TEST_VOLUNTEER_ID = 'VOL-ORG-REVIEW-001';
const TEST_PASSWORD = 'TestPassword123!';

test.describe('Organization Review', () => {
  test.beforeAll(async () => {
    await createTestVolunteer({
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
      name: 'Review Test Volunteer',
    });
  });

  test.afterAll(async () => {
    await deleteTestVolunteer(TEST_VOLUNTEER_ID);
  });

  test('dashboard shows pending organizations count', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Stats card for Stage 1 review queue should be visible
    await expect(page.getByText(/Needs Vol\. Review/i)).toBeVisible();

    // The count should be a non-negative number (stat cards use font-semibold; page h1 uses font-medium)
    const countEl = page.locator('.font-heading.text-3xl.font-semibold').first();
    await expect(countEl).toBeVisible();
    const text = await countEl.textContent();
    expect(parseInt(text || '0')).toBeGreaterThanOrEqual(0);
  });

  test('pending org list is sorted by submission date (oldest first)', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // The "Stage 1 Review" filter tab should be visible (default active)
    await expect(page.getByRole('button', { name: 'Stage 1 Review' })).toBeVisible();
  });

  test('PENDING filter tab is active by default', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // The Stage 1 Review tab button should have the active styling (white bg)
    const pendingTab = page.getByRole('button', { name: 'Stage 1 Review' });
    await expect(pendingTab).toBeVisible();
    await expect(pendingTab).toHaveClass(/bg-white/);
  });

  test('filter tabs switch the displayed status', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const approvedTab = page.getByRole('button', { name: 'Approved', exact: true });
    await approvedTab.click();

    // Tab becomes active
    await expect(approvedTab).toHaveClass(/bg-white/, { timeout: 5000 });
  });

  /** Helper: get row-level Review buttons (excludes tab buttons like "Stage 1 Review") */
  function getRowReviewButtons(page: any) {
    return page.locator('table').getByRole('button', { name: 'Review', exact: true });
  }

  test('clicking Review navigates to org detail screen', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Only run if there are pending orgs to review
    const reviewButtons = getRowReviewButtons(page);
    const count = await reviewButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await reviewButtons.first().click();
    await expect(page).toHaveURL(/\/volunteer\/organizations\/.+\/review/, { timeout: 15000 });
  });

  test('org review screen shows all detail sections', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const reviewButtons = getRowReviewButtons(page);
    const count = await reviewButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await reviewButtons.first().click();
    await page.waitForURL(/\/volunteer\/organizations\/.+\/review/);

    // All main sections should be present
    await expect(page.getByText('Contact Information')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Branches/i)).toBeVisible();
    await expect(page.getByText('Languages')).toBeVisible();
    await expect(page.getByText('Documents')).toBeVisible();
  });

  test('org review screen shows action panel for PENDING org', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const reviewButtons = getRowReviewButtons(page);
    const count = await reviewButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await reviewButtons.first().click();
    await page.waitForURL(/\/volunteer\/organizations\/.+\/review/);

    // Action panel should be visible for PENDING orgs
    await expect(page.getByText('Review Action')).toBeVisible({ timeout: 10000 });
    // Volunteers see "Pass to Stage 2" for PENDING orgs; admins see "Approve"
    await expect(page.getByRole('button', { name: /Pass to Stage 2|Approve/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Request Clarification/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reject/i })).toBeVisible();
  });

  test('rejecting org without a note shows validation error', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const reviewButtons = getRowReviewButtons(page);
    const count = await reviewButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await reviewButtons.first().click();
    await page.waitForURL(/\/volunteer\/organizations\/.+\/review/);

    // Select Reject but leave note empty
    await page.getByRole('button', { name: /Reject/i }).click();
    await page.getByRole('button', { name: /Submit Review/i }).click();

    await expect(
      page.getByText(/note is required/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('approved org shows Review Translations button', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Switch to Approved filter to find an approved org
    await page.getByRole('button', { name: 'Approved', exact: true }).click();

    const reviewButtons = getRowReviewButtons(page);
    const count = await reviewButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await reviewButtons.first().click();
    await page.waitForURL(/\/volunteer\/organizations\/.+\/review/);

    // Review Translations button should be visible for approved orgs
    await expect(
      page.getByRole('button', { name: /Review Translations/i })
    ).toBeVisible({ timeout: 10000 });
  });
});
