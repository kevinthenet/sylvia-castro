import AxeBuilder from '@axe-core/playwright';
import { Language, localizedText } from 'src/i18n';

import { expect, test } from './base-test';

let language: Language;

test.beforeEach(async ({ page }) => {
  const locale = await page.evaluate(() => window.navigator.language);
  language = locale.slice(0, 2) as Language;
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

test(`should contain in title: Contact Us`, async ({ page }) => {
  await expect(page).toHaveTitle(localizedText(language, 'contact.title'));
});

test(`should contain a localized heading`, async ({ page }) => {
  const contactHeading = page.getByRole('heading', {
    level: 1,
    name: localizedText(language, 'contact.header'),
  });
  await expect(contactHeading).toBeVisible();
});

test(`should contain an address`, async ({ page }) => {
  const addressLine1 = page.getByRole('paragraph').filter({ hasText: 'San Diego, CA' });

  await expect(addressLine1).toBeVisible();
});

test(`should contain a phone number that can be dialed from the site`, async ({ page }) => {
  const phoneNumber = page.getByRole('link').filter({ hasText: '+1 (619) 572-3537' });

  await expect(phoneNumber).toBeVisible();
  await phoneNumber.click();
  await expect(page).toHaveURL(/contact/);
});

test(`should have a clickable link to email hello@sylvia-castro.com`, async ({ page }) => {
  const contactEmail = page.getByRole('link').filter({ hasText: 'hello@sylvia-castro.com' });

  await expect(contactEmail).toBeVisible();
  await contactEmail.click();
  // verify there's no navigation on click, since it's a mailto: link
  await expect(page).toHaveURL(/contact/);
});

test.describe('contact form', () => {
  let language: Language;
  let fields: string[] = [];

  test.beforeEach(async ({ page }) => {
    // set up a route to intercept FormKeep requests and respond with 200
    await page.route('https://formkeep.com/f/bf8f2fdda780', async (route, request) => {
      console.log(`Request to ${request.url()} intercepted by Playwright`);
      console.log(await request.allHeaders());
      console.log(request.postData());
      await route.fulfill({ status: 200 });
    });

    const locale = await page.evaluate(() => window.navigator.language);
    language = locale.slice(0, 2) as Language;
    fields = [
      localizedText(language, 'contact.form.fullName'),
      localizedText(language, 'contact.form.email'),
      localizedText(language, 'contact.form.message'),
    ];
  });

  for (const field of fields) {
    test(`contains field: ${field}`, async ({ page }) => {
      await expect(page.getByLabel(field)).toBeVisible();
    });
  }

  test(`should display an error toast with invalid input`, async ({ page }) => {
    // explicitly abort requests to FormKeep, just for extra safety
    await page.route('https://formkeep.com/f/bf8f2fdda780', async (route, request) => {
      console.log(`Request to ${request.url()} intercepted by Playwright, will be aborted`);
      console.log(await request.allHeaders());
      console.log(request.postData());
      await route.abort('failed');
    });

    fields.forEach(async (field: string) => {
      await page.getByLabel(field).fill('asdf');
    });

    await page
      .getByRole('button', { name: localizedText(language, 'contact.form.submit') })
      .click();
    await expect(page.locator('#failure-toast')).toBeVisible();
    // should be invisible after some 5 seconds
    await expect(page.locator('#failure-toast')).not.toBeVisible({ timeout: 7000 });
  });

  test(`should display a success toast and confetti with valid input`, async ({ page }) => {
    await page.getByLabel(localizedText(language, 'contact.form.fullName')).fill('Test Person');
    await page
      .getByLabel(localizedText(language, 'contact.form.email'))
      .fill('test@sylvia-castro.com');
    await page.getByLabel(localizedText(language, 'contact.form.message')).fill('This is a test');

    await page
      .getByRole('button', { name: localizedText(language, 'contact.form.submit') })
      .click();
    await expect(page).toHaveURL(/contact/);
    await expect(page.locator('#success-toast')).toBeVisible();
    // confetti will be put into a canvas element
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('canvas')).not.toBeVisible({ timeout: 7000 });
    await expect(page.locator('#success-toast')).not.toBeVisible({ timeout: 7000 });

    // assert the values are reset after successful submission
    expect(
      await page.getByLabel(localizedText(language, 'contact.form.fullName')).inputValue()
    ).toBe('');
    expect(await page.getByLabel(localizedText(language, 'contact.form.email')).inputValue()).toBe(
      ''
    );
    expect(
      await page.getByLabel(localizedText(language, 'contact.form.message')).inputValue()
    ).toBe('');
  });
});
