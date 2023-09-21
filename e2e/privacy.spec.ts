import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/privacy');
});

test.skip('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);

  // test dark mode for accessibility violations as well
  await page.getByRole('button').filter({ hasText: 'Toggle theme mode' }).click();

  const darkModeAccessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(darkModeAccessibilityScanResults.violations).toEqual([]);
});

test('should contain in title: Privacy policy', async ({ page }) => {
  await expect(page).toHaveTitle(/Privacy policy/);
});

test('should contain heading: Privacy policy', async ({ page }) => {
  await expect(
    page.getByRole('heading', { level: 1 }).filter({ hasText: 'Privacy Policy' })
  ).toBeVisible();
});

test('should contain 3 headings on the page', async ({ page }) => {
  await expect(page.locator('main h2')).toContainText([
    '1. Information We Collect',
    '2. How We Use Your Information',
    'Contact Us',
  ]);
});

test('should have a clickable link to email privacy@castrohomebuilders.com', async ({ page }) => {
  const contactEmail = page.getByRole('link').filter({ hasText: 'privacy@castrohomebuilders.com' });

  await expect(contactEmail).toBeVisible();
  await contactEmail.click();
  // verify there's no navigation, since it's a mailto: link
  await expect(page).toHaveURL(/privacy/);
});
