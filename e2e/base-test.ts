import { test as base } from '@playwright/test';

import { RequestBlocker } from './request-blocker';

// override base page by using requestBlocker
export const test = base.extend({
  page: async ({ page }, use) => {
    const requestBlocker = new RequestBlocker(page);
    await requestBlocker.blockImages();
    await requestBlocker.blockScripts();

    await use(page);
  },
});
export { expect } from '@playwright/test';
