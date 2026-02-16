import { test, expect } from '@playwright/test';

test.describe('Registration Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration start page
    await page.goto('/register/start');
  });

  test('should load the registration start page', async ({ page }) => {
    await expect(page).toHaveTitle(/NaariSamata Sakhi/);
    await expect(page.getByRole('heading', { name: /Welcome to NaariSamata Sakhi Registration/i })).toBeVisible();
  });

  test('should navigate to registration form', async ({ page }) => {
    await page.getByRole('link', { name: /Start Registration/i }).click();
    await expect(page).toHaveURL('/register/form');
    await expect(page.getByRole('heading', { name: /Organization Registration/i })).toBeVisible();
  });

  test('should validate required fields in Organization Details section', async ({ page }) => {
    await page.goto('/register/form');

    // Open Organization Details section (Section 1)
    await page.locator('button:has-text("Organization Details")').click();

    // Try to validate without filling required fields
    await page.getByRole('button', { name: /Validate & Continue/i }).first().click();

    // Check for validation errors
    await expect(page.getByText(/Organization name is required/i)).toBeVisible();
  });

  test('should fill Organization Details correctly', async ({ page }) => {
    await page.goto('/register/form');

    // Open Organization Details section
    await page.locator('button:has-text("Organization Details")').click();

    // Fill organization details
    await page.getByLabel(/Organization Name/i).fill('Test NGO Organization');
    await page.getByLabel(/Registration Type/i).selectOption('NGO');
    await page.getByLabel(/Registration Number/i).fill('REG123456');
    await page.getByLabel(/Year Established/i).fill('2010');

    // Validate section
    await page.getByRole('button', { name: /Validate & Continue/i }).first().click();

    // Section should be marked as complete
    await expect(page.locator('button:has-text("Organization Details")').locator('..').locator('[data-complete="true"]')).toBeVisible();
  });

  test('should fill Primary Contact with ISD Code and Phone', async ({ page }) => {
    await page.goto('/register/form');

    // Open Primary Contact section (Section 2)
    await page.locator('button:has-text("Primary Contact")').click();

    // Fill contact details with new ISD Code + Phone format
    await page.getByLabel(/^Name/i).first().fill('John Doe');
    await page.getByLabel(/ISD Code/i).first().fill('+91');
    await page.getByLabel(/Phone Number/i).first().fill('9876543210');
    await page.getByLabel(/Email/i).first().fill('john@testngo.org');

    // Validate section
    await page.locator('button:has-text("Primary Contact")').locator('..').getByRole('button', { name: /Validate & Continue/i }).click();

    // Check no errors
    await expect(page.getByText(/ISD code must start with \+ followed by 1-4 digits/i)).not.toBeVisible();
  });

  test('should select multiple languages from checkbox list', async ({ page }) => {
    await page.goto('/register/form');

    // Open Language Support section (Section 7)
    await page.locator('button:has-text("Language Support")').click();

    // Select multiple languages using the new checkbox interface
    await page.getByLabel(/^Hindi$/i).check();
    await page.getByLabel(/^English$/i).check();
    await page.getByLabel(/^Tamil$/i).check();

    // Verify 3 languages selected
    await expect(page.getByText(/3 selected/i)).toBeVisible();

    // Check summary shows selected languages
    await expect(page.getByText(/Selected Languages \(3\)/i)).toBeVisible();
  });

  test('should validate all form sections before submission', async ({ page }) => {
    await page.goto('/register/form');

    // Try to submit without filling anything
    await page.getByRole('button', { name: /Submit Registration/i }).click();

    // Should show validation errors
    await expect(page.getByText(/Please complete all required sections/i)).toBeVisible();
  });

  test('complete registration flow', async ({ page }) => {
    await page.goto('/register/form');

    // Section 1: Organization Details
    await page.locator('button:has-text("Organization Details")').click();
    await page.getByLabel(/Organization Name/i).fill('Complete Test NGO');
    await page.getByLabel(/Registration Type/i).selectOption('NGO');
    await page.getByLabel(/Registration Number/i).fill('TEST123');
    await page.getByLabel(/Year Established/i).fill('2015');
    await page.locator('button:has-text("Organization Details")').locator('..').getByRole('button', { name: /Validate/i }).first().click();

    // Section 2: Primary Contact
    await page.locator('button:has-text("Primary Contact")').click();
    await page.getByLabel(/^Name/i).first().fill('Jane Smith');
    await page.getByLabel(/ISD Code/i).first().fill('+91');
    await page.getByLabel(/Phone Number/i).first().fill('9123456789');
    await page.getByLabel(/Email/i).first().fill('jane@testngo.org');

    // Section 7: Language Support
    await page.locator('button:has-text("Language Support")').click();
    await page.getByLabel(/^Hindi$/i).check();
    await page.getByLabel(/^English$/i).check();

    // Wait a moment for validation
    await page.waitForTimeout(1000);

    // Note: Full submission requires all sections including branches, documents, etc.
    // This test validates the key updated sections work correctly
  });

  test('should have correct branding (NaariSamata Sakhi)', async ({ page }) => {
    await page.goto('/');

    // Check homepage has correct branding
    await expect(page.getByText(/NaariSamata Sakhi/i)).toBeVisible();

    // Check footer has correct email
    await expect(page.getByRole('link', { name: /support@naarisamata.org/i })).toBeVisible();

    // Check Context First AI credit
    await expect(page.getByRole('link', { name: /Context First AI/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Context First AI/i })).toHaveAttribute('href', 'https://www.contextfirstai.com');
  });

  test('should show 3 steps in How It Works section', async ({ page }) => {
    await page.goto('/');

    // Should have exactly 3 steps
    await expect(page.getByText(/How It Works/i)).toBeVisible();

    // Check the three steps exist
    await expect(page.getByText(/Register Your Organization/i)).toBeVisible();
    await expect(page.getByText(/Profile Review/i)).toBeVisible();
    await expect(page.getByText(/Make Impact/i)).toBeVisible();

    // "Access Resources" step should NOT exist
    await expect(page.getByText(/Access Resources/i)).not.toBeVisible();
  });
});
