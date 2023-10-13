import type { Page } from '@playwright/test';

export class RequestBlocker {
  constructor(public readonly page: Page) {}

  async blockImages() {
    const blockList = ['cloudinary'];

    const regex = new RegExp(`${blockList.join('|')}`);

    // Abort based on the request resource type: image
    await this.page.route(regex, (route) => {
      if (route.request().resourceType() === 'image') {
        console.debug(
          `[RequestBlocker.resourceType] image request aborted: [url: ${route.request().url()}]`
        );
        return route.abort('aborted');
      }

      return route.continue();
    });

    return;
  }

  async blockScripts() {
    const blockList = ['googletagmanager'];

    const regex = new RegExp(`${blockList.join('|')}`);

    await this.page.route(regex, (route) => {
      if (route.request().resourceType() === 'script') {
        console.debug(
          `[RequestBlocker.resourceType] script request aborted: [url: ${route.request().url()}]`
        );
        return route.abort('aborted');
      }

      return route.continue();
    });
  }
}
