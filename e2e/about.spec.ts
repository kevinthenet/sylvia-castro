import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/about');
});

test.skip('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);

  // test dark mode for accessibility violations as well
  await page.getByRole('button').filter({ hasText: 'Toggle theme mode' }).click();

  const darkModeAccessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(darkModeAccessibilityScanResults.violations).toEqual([]);
});

test('should contain in title: About', async ({ page }) => {
  await expect(page).toHaveTitle(/About/);
});

test('should contain a mission section', async ({ page }) => {
  const missionSection = page.locator('section').filter({ hasText: 'Our Mission' });

  await expect(missionSection).toBeVisible();
  await expect(missionSection.locator('dl dt')).toContainText([
    'Established',
    'Projects',
    'Concurrent Project Teams',
    'Awards',
  ]);
});

test('should have a values section', async ({ page }) => {
  const valuesSection = page.locator('section').filter({ hasText: 'Our Values' });

  await expect(valuesSection).toBeVisible();

  await expect(valuesSection.locator('h3')).toContainText([
    'Excellence',
    'Communication', // this happens because communication appears first in vertical order
    'Accountability',
    'Respect',
  ]);
});

test('should have a "Meet our team" section', async ({ page }) => {
  const meetOurTeamSection = page.locator('section').filter({ hasText: 'Meet our team' });
  await expect(meetOurTeamSection).toBeVisible();
  await expect(meetOurTeamSection.locator('h3')).toContainText(['Victor Castro', 'Kevin Castro']);
});
