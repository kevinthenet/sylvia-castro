import { Language, localizedText } from 'src/i18n';

import { expect, test } from './base-test';

let language: Language;
let internalLinkNames: string[] = [];

test.beforeEach(async ({ page }) => {
  const locale = await page.evaluate(() => window.navigator.language);
  language = locale.slice(0, 2) as Language;

  const internalLinks = localizedText(language, 'header.links');
  internalLinkNames = internalLinks.map((l) => l.name);

  const availablePages = ['/', '/about', '/contact', '/privacy', '/404'];
  const randomIndex = Math.floor(Math.random() * availablePages.length);
  // sample from all pages to verify this works in all pages
  await page.goto(availablePages[randomIndex]);
});

test('should have a logo', async ({ page }) => {
  const header = page.locator('header');

  await expect(header.getByAltText('Sylvia Castro Logo')).toBeVisible();
});

const buttonSelectors = ['#toggle-locale', '#toggle-theme', '#toggle-menu'];
for (const selector of buttonSelectors) {
  test(`should have a clickable ${selector} button`, async ({ page }) => {
    const header = page.locator('header');
    const button = header.locator(selector);
    await expect(button).toBeVisible();
    await button.click({ trial: true });
  });
}

test('should have some description text', async ({ page }) => {
  const header = page.locator('header');

  const menuToggle = header
    .getByRole('button')
    .filter({ hasText: localizedText(language, 'header.toggleMenu') });
  // expand header section
  await menuToggle.click();

  await expect(
    header.getByRole('paragraph').filter({ hasText: localizedText(language, 'header.description') })
  ).toBeVisible();
});

for (const link of internalLinkNames) {
  test(`should have an internal company link: ${link}`, async ({ page }) => {
    const header = page.locator('header');

    const menuToggle = header
      .getByRole('button')
      .filter({ hasText: localizedText(language, 'header.toggleMenu') });
    // expand header section
    await menuToggle.click();

    const internalLink = header.getByRole('link', { name: link, exact: true });
    await expect(internalLink).toBeVisible();

    await internalLink.click();
    await expect(page).toHaveURL(/sylvia-castro/);
  });
}
