// Auth helpers for Playwright tests

import { Page } from '@playwright/test';

/** Logs in as a volunteer using the volunteer login page */
export async function loginAsVolunteer(
  page: Page,
  opts: { volunteerId: string; password: string }
): Promise<void> {
  await page.goto('/volunteer/login');
  await page.getByLabel(/Volunteer ID/i).fill(opts.volunteerId);
  await page.getByLabel(/Password/i).fill(opts.password);
  await page.getByRole('button', { name: /Sign in/i }).click();
  // Wait for redirect to dashboard
  await page.waitForURL('/volunteer/dashboard', { timeout: 15000 });
}

/** Logs out and verifies redirect to login */
export async function logout(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Sign out/i }).click();
  await page.waitForURL('/volunteer/login', { timeout: 10000 });
}
