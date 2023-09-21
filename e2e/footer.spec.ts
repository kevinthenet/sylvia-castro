import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const availablePages = ['/', '/about', '/contact', '/privacy', '/404'];
  const randomIndex = Math.floor(Math.random() * availablePages.length);
  // intentionally go to any page to verify this works in all pages
  await page.goto(availablePages[randomIndex]);
});

test('should have a logo', async ({ page }) => {
  const footer = page.locator('footer');

  await expect(footer.getByAltText('Castro Home Builders Logo')).toBeVisible();
});

test('should have some description text', async ({ page }) => {
  const footer = page.locator('footer');

  await expect(
    footer.getByRole('paragraph').filter({ hasText: 'one home at a time' })
  ).toBeVisible();
});

test('should have a clickable license number, opening a new tab to the CSLB government site', async ({
  page,
}) => {
  const footer = page.locator('footer');

  const licenseNumber = footer.getByLabel('License');
  await expect(licenseNumber).toBeVisible();

  const newTabPromise = page.waitForEvent('popup');
  await licenseNumber.click();
  const newTab = await newTabPromise;

  await newTab.waitForLoadState();
  await expect(newTab).toHaveURL(/cslb\.ca\.gov/);
});

test('should have a clickable image, opening a new tab to the BBB accreditation information', async ({
  page,
}) => {
  const footer = page.locator('footer');

  const bbbImage = footer.getByAltText('Better Business Bureau Accredited Business');
  await expect(bbbImage).toBeVisible();

  const newTabPromise = page.waitForEvent('popup');
  await bbbImage.click();
  const newTab = await newTabPromise;

  await newTab.waitForLoadState();
  await expect(newTab).toHaveURL(/bbb\.org/);
});

const socialLinks = ['Yelp', 'Houzz', 'Facebook'];
for (const link of socialLinks) {
  test(`should have an external link to: ${link}`, async ({ page }) => {
    const footer = page.locator('footer');

    const socialLink = footer.getByRole('link', { name: link });
    await expect(socialLink).toBeVisible();

    const newTabPromise = page.waitForEvent('popup');
    await socialLink.click();
    const newTab = await newTabPromise;

    await newTab.waitForLoadState();
    await expect(newTab).not.toHaveURL(/castrohomebuilders/);
  });
}

const internalLinks = ['Home', 'About', 'Contact', 'Privacy'];
for (const link of internalLinks) {
  test(`should have an internal company link: ${link}`, async ({ page }) => {
    const footer = page.locator('footer');

    const internalLink = footer.getByRole('link', { name: link });
    await expect(internalLink).toBeVisible();

    await internalLink.click();
    await expect(page).toHaveURL(/castrohomebuilders/);
  });
}
