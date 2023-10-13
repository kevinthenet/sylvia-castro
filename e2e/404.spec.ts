import AxeBuilder from '@axe-core/playwright';
import { Language, localizedText } from 'src/i18n';

import { expect, test } from './base-test';

let language: Language;

test.beforeEach(async ({ page }) => {
  const locale = await page.evaluate(() => window.navigator.language);
  language = locale.slice(0, 2) as Language;
  await page.goto('/404');
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

test('has localized title', async ({ page }) => {
  await expect(page).toHaveTitle(localizedText(language, '404.title'));
});

test('has button: "Go back home" which navigates back to homepage', async ({ page }) => {
  const btn = page.getByRole('link').filter({ hasText: localizedText(language, '404.action') });
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Sylvia Castro');
});

test('navigating to an unknown page will render the 404 page', async ({ page }) => {
  const generateRandomString = (myLength: number) => {
    const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join('');
    return randomString;
  };

  const randomPage = generateRandomString(12);
  console.log(`Navigating to: /${randomPage}`);
  await page.goto(`/${randomPage}`);
  await expect(page).toHaveTitle(localizedText(language, '404.title'));
});
