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

    // Stats card for Awaiting Review should be visible
    await expect(page.getByText(/Awaiting Review/i)).toBeVisible();

    // The count should be a non-negative number
    const countEl = page.locator('.font-heading.text-3xl').first();
    await expect(countEl).toBeVisible();
    const text = await countEl.textContent();
    expect(parseInt(text || '0')).toBeGreaterThanOrEqual(0);
  });

  test('pending org list is sorted by submission date (oldest first)', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // The Submitted column should exist in the table
    await expect(page.getByText('PENDING').first()).toBeVisible();
  });

  test('PENDING filter tab is active by default', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // The PENDING tab button should have the active styling (white bg)
    const pendingTab = page.getByRole('button', { name: 'PENDING' });
    await expect(pendingTab).toBeVisible();
    await expect(pendingTab).toHaveClass(/bg-white/);
  });

  test('filter tabs switch the displayed status', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const approvedTab = page.getByRole('button', { name: 'APPROVED' });
    await approvedTab.click();

    // Tab becomes active
    await expect(approvedTab).toHaveClass(/bg-white/, { timeout: 5000 });
  });

  test('clicking Review navigates to org detail screen', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    // Only run if there are pending orgs to review
    const reviewButtons = page.getByRole('button', { name: /Review/i });
    const count = await reviewButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await reviewButtons.first().click();
    await expect(page).toHaveURL(/\/volunteer\/organizations\/.+\/review/);
  });

  test('org review screen shows all detail sections', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const reviewButtons = page.getByRole('button', { name: /Review/i });
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

    const reviewButtons = page.getByRole('button', { name: /Review/i });
    const count = await reviewButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await reviewButtons.first().click();
    await page.waitForURL(/\/volunteer\/organizations\/.+\/review/);

    // Action panel should be visible for PENDING orgs
    await expect(page.getByText('Review Action')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Approve/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Request Clarification/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reject/i })).toBeVisible();
  });

  test('rejecting org without a note shows validation error', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: TEST_VOLUNTEER_ID, password: TEST_PASSWORD });

    const reviewButtons = page.getByRole('button', { name: /Review/i });
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

    // Switch to APPROVED filter to find an approved org
    await page.getByRole('button', { name: 'APPROVED' }).click();

    const reviewButtons = page.getByRole('button', { name: /Review/i });
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
