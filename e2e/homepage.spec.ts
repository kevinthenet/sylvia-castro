import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.skip('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);

  // test dark mode for accessibility violations as well
  await page.getByRole('button').filter({ hasText: 'Toggle theme mode' }).click();

  const darkModeAccessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(darkModeAccessibilityScanResults.violations).toEqual([]);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle('Castro Home Builders');
});

test('has "Learn More" and "Get an Estimate" buttons which lead to the about and contact page, respectively', async ({
  page,
}) => {
  const aboutButton = page.getByRole('link', { name: 'Learn More' });
  await expect(aboutButton).toBeVisible();
  await aboutButton.click();
  expect(page.url()).toContain('about');
  await expect(page).toHaveTitle(/About/);

  // reset
  page.goto('/');

  const contactButton = page.getByRole('link', { name: 'Get an Estimate' });
  await expect(contactButton).toBeVisible();
  await contactButton.click();
  expect(page.url()).toContain('contact');
  await expect(page).toHaveTitle(/Contact/);
});

test('has a services section with collapsed category lists', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 2, name: 'Service' })).toBeVisible();

  await expect(page.getByText('Foundations and Structural Work')).toBeVisible();

  await expect(
    page.getByRole('listitem').filter({ hasText: 'Foundations and Excavations' })
  ).toBeHidden();
});

test('has an about us section with a "Read More" button that leads to the about page', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { level: 2, name: 'About Us' })).toBeVisible();

  const btn = page.getByRole('link', { name: 'Read More' });
  await expect(btn).toBeVisible();
  await btn.click();
  expect(page.url()).toContain('about');
  await expect(page).toHaveTitle(/About/);
});

test('has a testimonials section', async ({ page }) => {
  await expect(page.getByRole('figure').filter({ hasText: 'Ruth Stergiou' })).toBeVisible();
});

test('has a CTA with a button that leads to the contact page', async ({ page }) => {
  await expect(
    page.getByRole('heading', { level: 2, name: "Let's build something together" })
  ).toBeVisible();

  const btn = page.getByRole('link', { name: 'Contact Us' });
  await expect(btn).toBeVisible();
  await btn.click();
  expect(page.url()).toContain('contact');
  await expect(page).toHaveTitle(/Contact/);
});
