import { Page, Locator, Response, test } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/'): Promise<void> {
    await test.step(`Navigate to "${path}"`, async () => {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    });
  }

  async click(locator: Locator, description?: string): Promise<void> {
    const desc = description || (await locator.toString());
    await test.step(`Click "${desc}"`, async () => {
      await locator.click();
    });
  }

  async fill(locator: Locator, value: string, description?: string): Promise<void> {
    const desc = description || (await locator.toString());
    await test.step(`Fill "${desc}" with value "${value}"`, async () => {
      await locator.fill(value);
    });
  }

  async selectDropdownOption(
    locator: Locator,
    valueOrLabel: string,
    description?: string
  ): Promise<void> {
    const desc = description || (await locator.toString());
    await test.step(`Select "${valueOrLabel}" from "${desc}"`, async () => {
      await locator.selectOption({ label: valueOrLabel });
    });
  }

  async check(locator: Locator, description?: string): Promise<void> {
    const desc = description || (await locator.toString());
    await test.step(`Check checkbox "${desc}"`, async () => {
      await locator.check();
    });
  }

  async getElementText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() || '';
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async waitForUrl(expectedUrlPart: string): Promise<void> {
    await this.page.waitForURL((url) => url.toString().includes(expectedUrlPart));
  }

  // --- Explicit Wait Utilities ---

  /**
   * Waits until the page reaches the desired load state.
   * @param state 'load' | 'domcontentloaded' | 'networkidle' (default: 'load')
   */
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await test.step(`Wait for page load state: "${state}"`, async () => {
      await this.page.waitForLoadState(state);
    });
  }

  /**
   * Waits until there are no network connections for at least 500ms.
   * Highly useful after heavy AJAX triggers or dynamic filters.
   * @param timeout Max wait time in milliseconds (default: 10000)
   */
  async waitForNetworkIdle(timeout = 10000): Promise<void> {
    await test.step('Wait for network idle', async () => {
      await this.page.waitForLoadState('networkidle', { timeout });
    });
  }

  /**
   * Concurrently triggers an action and awaits a matching backend HTTP/API response.
   * Eliminates race conditions in single-page apps and asynchronous flows.
   * @param urlOrPredicate URL substring, RegExp, or predicate function
   * @param triggerAction The async UI action that triggers the request (e.g. click button)
   * @param timeout Max wait time in milliseconds (default: 15000)
   */
  async waitForApiResponse(
    urlOrPredicate: string | RegExp | ((response: Response) => boolean | Promise<boolean>),
    triggerAction: () => Promise<void>,
    timeout = 15000
  ): Promise<Response> {
    return await test.step('Wait for API response and execute trigger action', async () => {
      const [response] = await Promise.all([
        this.page.waitForResponse(urlOrPredicate, { timeout }),
        triggerAction(),
      ]);
      return response;
    });
  }

  /**
   * Explicitly waits for an element to transition into a specific DOM state.
   * @param locator Target Playwright Locator
   * @param state 'visible' | 'hidden' | 'attached' | 'detached'
   * @param timeout Max wait time in milliseconds (default: 10000)
   */
  async waitForElementState(
    locator: Locator,
    state: 'visible' | 'hidden' | 'attached' | 'detached',
    timeout = 10000
  ): Promise<void> {
    await test.step(`Wait for element state: "${state}"`, async () => {
      await locator.waitFor({ state, timeout });
    });
  }

  /**
   * Waits for loading spinners, backdrops, or skeleton overlays to disappear.
   * @param spinnerLocator Optional custom spinner locator (defaults to common loader classes)
   * @param timeout Max wait time in milliseconds (default: 10000)
   */
  async waitForSpinnerToDisappear(spinnerLocator?: Locator, timeout = 10000): Promise<void> {
    const loader = spinnerLocator || this.page.locator('.loading, .spinner, .ajax-loading-block-window');
    await test.step('Wait for loading spinner to disappear', async () => {
      if (await loader.isVisible()) {
        await loader.waitFor({ state: 'hidden', timeout });
      }
    });
  }
}
