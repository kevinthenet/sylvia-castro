import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { localizedText, Language } from 'src/i18n';

let language: Language;

test.beforeEach(async ({ page }) => {
  const locale = await page.evaluate(() => window.navigator.language);
  language = locale.slice(0, 2) as Language;
  await page.goto('/about');
});

test.skip('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);

  // test dark mode for accessibility violations as well
  await page
    .getByRole('button')
    .filter({ hasText: localizedText(language, 'header.toggleMenu') })
    .click();

  const darkModeAccessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(darkModeAccessibilityScanResults.violations).toEqual([]);
});

test('should contain localized title', async ({ page }) => {
  await expect(page).toHaveTitle(localizedText(language, 'about.title'));
});

test('should contain a localized mission section', async ({ page }) => {
  const missionSection = page
    .locator('section')
    .filter({ hasText: localizedText(language, 'about.missionSection.header') });

  const stats = localizedText(language, 'about.missionSection.stats');

  await expect(missionSection).toBeVisible();
  await expect(missionSection.locator('dl:not(.hidden) dt')).toContainText(
    stats.map((stat) => stat.name)
  );
});

test('should have a localized values section', async ({ page }) => {
  const valuesSection = page
    .locator('section')
    .filter({ hasText: localizedText(language, 'about.valuesSection.header') });

  await expect(valuesSection).toBeVisible();

  const values = localizedText(language, 'about.valuesSection.values');
  const [valuesCol1, valuesCol2] = values;

  await expect(valuesSection.locator('h3')).toContainText([
    ...valuesCol1.map((v) => v.name),
    ...valuesCol2.map((v) => v.name),
  ]);
});
