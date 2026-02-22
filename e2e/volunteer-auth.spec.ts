import { test, expect } from '@playwright/test';
import { createTestVolunteer, deleteTestVolunteer } from './helpers/test-data';
import { loginAsVolunteer, logout } from './helpers/auth';

const TEST_VOLUNTEER_ID = 'VOL-TEST-E2E-001';
const TEST_PASSWORD = 'TestPassword123!';

test.describe('Volunteer Authentication', () => {
  test.beforeAll(async () => {
    await createTestVolunteer({
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
      name: 'E2E Test Volunteer',
    });
  });

  test.afterAll(async () => {
    await deleteTestVolunteer(TEST_VOLUNTEER_ID);
  });

  test('volunteer login page loads', async ({ page }) => {
    await page.goto('/volunteer/login');
    await expect(page).toHaveURL('/volunteer/login');
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
    await expect(page.getByLabel(/Volunteer ID/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
  });

  test('shows NaariSamata branding on login page', async ({ page }) => {
    await page.goto('/volunteer/login');
    await expect(page.getByText('NaariSamata')).toBeVisible();
    await expect(page.getByText('Volunteer Portal')).toBeVisible();
  });

  test('login with valid volunteer ID and password succeeds', async ({ page }) => {
    await loginAsVolunteer(page, {
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
    });
    // Should land on dashboard
    await expect(page).toHaveURL('/volunteer/dashboard');
  });

  test('logged-in volunteer sees their name in the header', async ({ page }) => {
    await loginAsVolunteer(page, {
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
    });
    // Header shows the volunteer's name or ID
    await expect(
      page.getByText(/E2E Test Volunteer|VOL-TEST-E2E-001/i).first()
    ).toBeVisible();
  });

  test('login with wrong password shows error', async ({ page }) => {
    await page.goto('/volunteer/login');
    await page.getByLabel(/Volunteer ID/i).fill(TEST_VOLUNTEER_ID);
    await page.getByLabel(/Password/i).fill('WrongPassword!');
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Should stay on login page and show error
    await expect(page).toHaveURL('/volunteer/login');
    await expect(
      page.getByText(/Invalid Volunteer ID or password/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('login with non-existent volunteer ID shows error', async ({ page }) => {
    await page.goto('/volunteer/login');
    await page.getByLabel(/Volunteer ID/i).fill('VOL-DOES-NOT-EXIST');
    await page.getByLabel(/Password/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /Sign in/i }).click();

    await expect(page).toHaveURL('/volunteer/login');
    await expect(
      page.getByText(/Invalid Volunteer ID or password/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('login with empty volunteer ID shows validation error', async ({ page }) => {
    await page.goto('/volunteer/login');
    await page.getByLabel(/Password/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /Sign in/i }).click();

    await expect(page).toHaveURL('/volunteer/login');
    await expect(
      page.getByText(/Volunteer ID is required/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('logout clears session and redirects to login', async ({ page }) => {
    await loginAsVolunteer(page, {
      volunteerId: TEST_VOLUNTEER_ID,
      password: TEST_PASSWORD,
    });
    await logout(page);
    await expect(page).toHaveURL('/volunteer/login');
  });

  test('accessing dashboard without login redirects to login', async ({ page }) => {
    await page.goto('/volunteer/dashboard');
    await expect(page).toHaveURL(/\/volunteer\/login/);
  });
});
