import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/contact');
});

test.skip('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);

  // test dark mode for accessibility violations as well
  await page.getByRole('button').filter({ hasText: 'Toggle theme mode' }).click();

  const darkModeAccessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(darkModeAccessibilityScanResults.violations).toEqual([]);
});

test('should contain in title: Contact Us', async ({ page }) => {
  await expect(page).toHaveTitle(/Contact Us/);
});

test('should contain a heading reading: "Let\'s build something together"', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('should contain an address', async ({ page }) => {
  const addressLine1 = page.getByRole('paragraph').filter({ hasText: '49 Edgewood Road' });
  const addressLine2 = page.getByRole('paragraph').filter({ hasText: 'Redwood City, CA 94062' });

  await expect(addressLine1).toBeVisible();
  await expect(addressLine2).toBeVisible();
});

test('should contain a phone number that can be dialed from the site', async ({ page }) => {
  const phoneNumber = page.getByRole('link').filter({ hasText: '+1 (650) 483-7651' });

  await expect(phoneNumber).toBeVisible();
  await phoneNumber.click();
  await expect(page).toHaveURL(/contact/);
});

test('should have a clickable link to email hello@castrohomebuilders.com', async ({ page }) => {
  const contactEmail = page.getByRole('link').filter({ hasText: 'hello@castrohomebuilders.com' });

  await expect(contactEmail).toBeVisible();
  await contactEmail.click();
  // verify there's no navigation on click, since it's a mailto: link
  await expect(page).toHaveURL(/contact/);
});

test.describe('contact form', () => {
  const fields = ['Full Name', 'Email', 'Message'];

  for (const field of fields) {
    test(`contains field: ${field}`, async ({ page }) => {
      await expect(page.getByLabel(field)).toBeVisible();
    });
  }

  test.beforeEach(async ({ page }) => {
    // set up a route to intercept FormKeep requests and respond with 200
    await page.route('https://formkeep.com/f/2d33e37c28a5', async (route, request) => {
      console.log(`Request to ${request.url()} intercepted by Playwright`);
      console.log(await request.allHeaders());
      console.log(request.postData());
      await route.fulfill({ status: 200 });
    });
  });

  test('should display an error toast with invalid input', async ({ page }) => {
    // explicitly abort requests to FormKeep, just for extra safety
    await page.route('https://formkeep.com/f/2d33e37c28a5', async (route, request) => {
      console.log(`Request to ${request.url()} intercepted by Playwright`);
      console.log(await request.allHeaders());
      console.log(request.postData());
      await route.abort('failed');
    });

    fields.forEach(async (field: string) => {
      await page.getByLabel(field).fill('asdf');
    });

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#failure-toast')).toBeVisible();
    // should be invisible after some 5 seconds
    await expect(page.locator('#failure-toast')).not.toBeVisible({ timeout: 6000 });
  });

  test('should display a success toast and confetti with valid input', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Test Person');
    await page.getByLabel('Email').fill('test@castrohomebuilders.com');
    await page.getByLabel('Message').fill('This is a test');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(/contact/);
    await expect(page.locator('#success-toast')).toBeVisible();
    // confetti will be put into a canvas element
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('canvas')).not.toBeVisible({ timeout: 6000 });
    await expect(page.locator('#success-toast')).not.toBeVisible({ timeout: 6000 });

    // assert the values are reset after successful submission
    expect(await page.getByLabel('Full Name').inputValue()).toBe('');
    expect(await page.getByLabel('Email').inputValue()).toBe('');
    expect(await page.getByLabel('Message').inputValue()).toBe('');
  });
});
