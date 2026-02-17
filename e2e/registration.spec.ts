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
    // Wait for the link to be visible and clickable
    const startLink = page.getByRole('link', { name: /Start Registration/i });
    await expect(startLink).toBeVisible();
    await startLink.click();

    // Wait for navigation to complete
    await page.waitForURL('/register/form');
    await expect(page.getByRole('heading', { name: /Organization Registration/i })).toBeVisible();
  });

  test('should validate required fields in Organization Details section', async ({ page }) => {
    await page.goto('/register/form', { waitUntil: 'networkidle' });

    // Clear any saved form data from previous test runs to ensure clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    // Wait for React hydration
    await page.waitForLoadState('domcontentloaded');

    // Section 1 starts open by default (useState(1))
    // Wait for the Organization Name field to be ready (API loading complete)
    const orgNameInput = page.getByLabel(/Organization Name/i);
    await expect(orgNameInput).toBeVisible({ timeout: 15000 });

    // Clear the field to ensure it's empty for validation testing
    await orgNameInput.fill('');

    // Click validate without filling required fields
    const validateButton = page.locator('#section-1-content').getByRole('button', { name: /Validate and continue/i });
    await validateButton.click({ force: true });

    // Check for validation errors
    await expect(page.getByText(/Organization name must be at least/i)).toBeVisible({ timeout: 5000 });
  });

  test('should fill Organization Details correctly', async ({ page }) => {
    await page.goto('/register/form', { waitUntil: 'networkidle' });

    // Section 1 starts open by default - wait for form to fully load (API response)
    const section1Content = page.locator('#section-1-content');
    const orgNameInput = page.getByLabel(/Organization Name/i);
    await expect(orgNameInput).toBeVisible({ timeout: 15000 });

    // Fill organization details
    await orgNameInput.fill('Test NGO Organization');
    await page.getByLabel(/Registration Type/i).selectOption('NGO');
    await page.getByLabel(/Registration Number/i).fill('REG123456');
    await page.getByLabel(/Year Established/i).fill('2010');

    // Validate section
    await section1Content.getByRole('button', { name: /Validate and continue/i }).click({ force: true });

    // Verify section 1 is marked as complete (success indicator appears in header)
    await expect(page.locator('#section-1-header').getByText(/Complete/i)).toBeVisible({ timeout: 5000 });
  });

  test('should fill Primary Contact with ISD Code and Phone', async ({ page }) => {
    await page.goto('/register/form', { waitUntil: 'networkidle' });

    // Open Primary Contact section (Section 2) - use ID to avoid ambiguity
    await page.locator('#section-2-header').click();

    // Wait for section content to be visible
    const section2Content = page.locator('#section-2-content');
    await expect(section2Content).toBeVisible({ timeout: 10000 });

    // Fill contact details with new ISD Code + Phone format
    const nameInput = page.locator('#section-2-content').getByLabel(/^Name/i);
    await nameInput.fill('John Doe');
    await page.locator('#section-2-content').getByLabel(/ISD Code/i).fill('+91');
    await page.locator('#section-2-content').getByLabel(/Phone Number/i).fill('9876543210');
    await page.locator('#section-2-content').getByLabel(/Email/i).fill('john@testngo.org');

    // Validate section
    await section2Content.getByRole('button', { name: /Validate and continue/i }).click({ force: true });

    // Verify section 2 is marked as complete (success indicator appears in header)
    await expect(page.locator('#section-2-header').getByText(/Complete/i)).toBeVisible({ timeout: 5000 });
  });

  test('should select multiple languages from checkbox list', async ({ page }) => {
    await page.goto('/register/form');

    // Open Language Support section (Section 7) - use ID to avoid ambiguity
    await page.locator('#section-7-header').click();

    // Wait for checkboxes to become visible
    const hindiCheckbox = page.getByLabel(/^Hindi$/i);
    await expect(hindiCheckbox).toBeVisible();

    // Select multiple languages using the new checkbox interface
    await hindiCheckbox.check();
    await page.getByLabel(/^English$/i).check();
    await page.getByLabel(/^Tamil$/i).check();

    // Verify 3 languages selected
    await expect(page.getByText(/3 selected/i)).toBeVisible();

    // Check summary shows selected languages
    await expect(page.getByText(/Selected Languages \(3\)/i)).toBeVisible();
  });

  test('should validate all form sections before submission', async ({ page }) => {
    await page.goto('/register/form');

    // Submit button should be disabled when no sections are complete
    const submitButton = page.getByRole('button', { name: /Submit Registration/i });
    await expect(submitButton).toBeDisabled();

    // Progress indicator should show 8 sections remaining
    await expect(page.getByText(/8 sections remaining/i)).toBeVisible();
  });

  test('complete registration flow', async ({ page }) => {
    await page.goto('/register/form');

    // Section 1: Organization Details - use ID to avoid ambiguity
    await page.locator('#section-1-header').click();
    const section1Content = page.locator('#section-1-content');
    await expect(section1Content).toBeVisible();
    await page.waitForTimeout(500);

    await page.getByLabel(/Organization Name/i).fill('Complete Test NGO');
    await page.getByLabel(/Registration Type/i).selectOption('NGO');
    await page.getByLabel(/Registration Number/i).fill('TEST123');
    await page.getByLabel(/Year Established/i).fill('2015');
    await section1Content.getByRole('button', { name: /Validate/i }).click({ force: true });

    // Section 2: Primary Contact - use ID to avoid ambiguity
    await page.locator('#section-2-header').click();
    const section2Content = page.locator('#section-2-content');
    await expect(section2Content).toBeVisible();
    await page.waitForTimeout(500);

    await page.getByLabel(/^Name/i).first().fill('Jane Smith');
    await page.getByLabel(/ISD Code/i).first().fill('+91');
    await page.getByLabel(/Phone Number/i).first().fill('9123456789');
    await page.getByLabel(/Email/i).first().fill('jane@testngo.org');

    // Section 7: Language Support - use ID to avoid ambiguity
    await page.locator('#section-7-header').click();
    const section7Content = page.locator('#section-7-content');
    await expect(section7Content).toBeVisible();
    await page.waitForTimeout(500);

    await page.getByLabel(/^Hindi$/i).check();
    await page.getByLabel(/^English$/i).check();

    // Verify languages were selected
    await expect(page.getByText(/2 selected/i)).toBeVisible();

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
