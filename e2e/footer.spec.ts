import { Language, localizedText } from 'src/i18n';

import { expect, test } from './base-test';

let language: Language;
let socialLinkNames: string[] = [];
let internalLinkNames: string[] = [];
let legalLinkNames: string[] = [];

test.beforeEach(async ({ page }) => {
  const locale = await page.evaluate(() => window.navigator.language);
  language = locale.slice(0, 2) as Language;

  const linkGroups = localizedText(language, 'footer.linkGroups');
  const [social, internal, legal] = linkGroups;
  socialLinkNames = social.links.map((l) => l.name);
  internalLinkNames = internal.links.map((l) => l.name);
  legalLinkNames = legal.links.map((l) => l.name);

  const availablePages = ['/', '/about', '/contact', '/privacy', '/404'];
  const randomIndex = Math.floor(Math.random() * availablePages.length);
  // intentionally go to any page to verify this works in all pages
  await page.goto(availablePages[randomIndex]);
});

test('should have a logo', async ({ page }) => {
  const footer = page.locator('footer');

  await expect(footer.getByAltText('Sylvia Castro Logo')).toBeVisible();
});

test('should have some description text', async ({ page }) => {
  const footer = page.locator('footer');

  await expect(
    footer.getByRole('paragraph').filter({ hasText: localizedText(language, 'footer.description') })
  ).toBeVisible();
});

for (const link of socialLinkNames) {
  test(`should have an external link to: ${link}`, async ({ page }) => {
    const footer = page.locator('footer');

    const socialLink = footer.getByRole('link', { name: link });
    await expect(socialLink).toBeVisible();

    const newTabPromise = page.waitForEvent('popup');
    await socialLink.click();
    const newTab = await newTabPromise;

    await newTab.waitForLoadState();
    await expect(newTab).not.toHaveURL(/sylvia-castro/);
  });
}

for (const link of internalLinkNames) {
  test(`should have an internal company link: ${link}`, async ({ page }) => {
    const footer = page.locator('footer');

    const internalLink = footer.getByRole('link', { name: link });
    await expect(internalLink).toBeVisible();

    await internalLink.click();
    await expect(page).toHaveURL(/sylvia-castro/);
  });
}

for (const link of legalLinkNames) {
  test(`should have an internal company link: ${link}`, async ({ page }) => {
    const footer = page.locator('footer');

    const internalLink = footer.getByRole('link', { name: link });
    await expect(internalLink).toBeVisible();

    await internalLink.click();
    await expect(page).toHaveURL(/sylvia-castro/);
  });
}
