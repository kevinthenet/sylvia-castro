import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { localizedText, Language } from 'src/i18n';

let language: Language;

test.beforeEach(async ({ page }) => {
  const locale = await page.evaluate(() => window.navigator.language);
  language = locale.slice(0, 2) as Language;
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
  await expect(page).toHaveTitle(localizedText(language, 'privacy.title'));
});

test('should contain heading: Privacy policy', async ({ page }) => {
  await expect(
    page
      .getByRole('heading', { level: 1 })
      .filter({ hasText: localizedText(language, 'privacy.header') })
  ).toBeVisible();
});

test('should contain 3 headings on the page', async ({ page }) => {
  const headings = [
    localizedText(language, 'privacy.informationCollected.header'),
    localizedText(language, 'privacy.informationUsage.header'),
    localizedText(language, 'privacy.contactInformation.header'),
  ];

  await expect(page.locator('main h2')).toContainText(headings);
});
