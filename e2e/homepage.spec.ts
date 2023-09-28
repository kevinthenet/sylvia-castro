import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { localizedText, Language } from 'src/i18n';

let language: Language;

test.beforeEach(async ({ page }) => {
  const locale = await page.evaluate(() => window.navigator.language);
  language = locale.slice(0, 2) as Language;
  await page.goto('/');
});

test.skip('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);

  // test dark mode for accessibility violations as well
  await page
    .getByRole('button')
    .filter({ hasText: localizedText(language, 'header.toggleTheme') })
    .click();

  const darkModeAccessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(darkModeAccessibilityScanResults.violations).toEqual([]);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle('Sylvia Castro');
});

test('has localized CTA buttons which lead to the about and contact page, respectively', async ({
  page,
}) => {
  const aboutButton = page.getByRole('link', {
    name: localizedText(language, 'homepage.heroSection.ctaButtons.about'),
  });
  await expect(aboutButton).toBeVisible();
  await aboutButton.click();
  expect(page.url()).toContain('about');

  // reset
  page.goto('/');

  const contactButton = page.getByRole('link', {
    name: localizedText(language, 'homepage.heroSection.ctaButtons.contact'),
  });
  await expect(contactButton).toBeVisible();
  await contactButton.click();
  expect(page.url()).toContain('contact');
});

test('has a services section with collapsed category lists', async ({ page }) => {
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: localizedText(language, 'homepage.serviceSection.header'),
    })
  ).toBeVisible();

  const serviceCategories = localizedText(language, 'homepage.serviceSection.serviceCategories');

  const firstCategory = serviceCategories[0];

  await expect(page.getByText(firstCategory.name)).toBeVisible();

  await expect(
    page.getByRole('listitem').filter({ hasText: firstCategory.services[0] })
  ).toBeHidden();
});

test('has an about me section with a button that leads to the about page', async ({ page }) => {
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: localizedText(language, 'homepage.aboutSection.header'),
    })
  ).toBeVisible();

  const btn = page.getByRole('link', {
    name: localizedText(language, 'homepage.aboutSection.button'),
  });
  await expect(btn).toBeVisible();
  await btn.click();
  expect(page.url()).toContain('about');
});

test('has a Recommendations section', async ({ page }) => {
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: localizedText(language, 'homepage.recommendationSection.header'),
    })
  ).toBeVisible();

  const recommendations = localizedText(language, 'homepage.recommendationSection.recommendations');

  await expect(page.getByRole('figure').filter({ hasText: recommendations[0].name })).toBeVisible();
});

test('has a CTA with a button that leads to the contact page', async ({ page }) => {
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: localizedText(language, 'homepage.ctaSection.header'),
    })
  ).toBeVisible();

  const btn = page.getByRole('link', {
    name: localizedText(language, 'homepage.ctaSection.button'),
  });
  await expect(btn).toBeVisible();
  await btn.click();
  expect(page.url()).toContain('contact');
});
