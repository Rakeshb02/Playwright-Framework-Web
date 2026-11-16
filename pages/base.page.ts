import { Page, Locator, test } from '@playwright/test';

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
}
