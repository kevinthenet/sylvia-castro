import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const availablePages = ['/', '/about', '/contact', '/privacy', '/404'];
  const randomIndex = Math.floor(Math.random() * availablePages.length);
  // intentionally go to any page to verify this works in all pages
  await page.goto(availablePages[randomIndex]);
});

test('should have a logo', async ({ page }) => {
  const header = page.locator('header');

  await expect(header.getByAltText('Castro Home Builders Logo')).toBeVisible();
});

test('should have a toggle theme button', async ({ page }) => {
  const header = page.locator('header');
  const toggleThemeButton = header.getByRole('button').filter({ hasText: 'Toggle theme mode' });
  await expect(toggleThemeButton).toBeVisible();
});

test('should have a clickable menu toggle', async ({ page }) => {
  const header = page.locator('header');

  const menuToggle = header.getByRole('button').filter({ hasText: 'Toggle Menu' });

  await expect(menuToggle).toBeVisible();
  await menuToggle.click({ trial: true });
});

test('should have some description text', async ({ page }) => {
  const header = page.locator('header');

  const menuToggle = header.getByRole('button').filter({ hasText: 'Toggle Menu' });
  // expand header section
  await menuToggle.click();

  await expect(
    header.getByRole('paragraph').filter({ hasText: 'one home at a time' })
  ).toBeVisible();
});

test('should have a clickable license number, which opens a new tab to the CSLB government site when clicked', async ({
  page,
}) => {
  const header = page.locator('header');

  const menuToggle = header.getByRole('button').filter({ hasText: 'Toggle Menu' });
  // expand header section
  await menuToggle.click();

  const licenseNumber = header.getByRole('link').filter({ hasText: 'License' });
  await expect(licenseNumber).toBeVisible();

  const newTabPromise = page.waitForEvent('popup');
  await licenseNumber.click();
  const newTab = await newTabPromise;

  await newTab.waitForLoadState();
  await expect(newTab).toHaveURL(/cslb\.ca\.gov/);
});

const internalLinks = ['Home', 'About', 'Contact'];
for (const link of internalLinks) {
  test(`should have an internal company link: ${link}`, async ({ page }) => {
    const header = page.locator('header');

    const menuToggle = header.getByRole('button').filter({ hasText: 'Toggle Menu' });
    // expand header section
    await menuToggle.click();

    const internalLink = header.getByRole('link', { name: link, exact: true });
    await expect(internalLink).toBeVisible();

    await internalLink.click();
    await expect(page).toHaveURL(/castrohomebuilders/);
  });
}
