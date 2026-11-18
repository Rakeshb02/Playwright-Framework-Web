import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly productItems: Locator;
  private readonly notificationBar: Locator;
  private readonly notificationCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.productItems = page.locator('.product-item');
    this.notificationBar = page.locator('#bar-notification');
    this.notificationCloseButton = page.locator('#bar-notification span.close');
  }

  // --- Actions ---

  async getPageTitleText(): Promise<string> {
    return await this.getElementText(this.pageTitle);
  }

  async getProductTitles(): Promise<string[]> {
    await this.waitForElementState(this.productItems.first(), 'visible');
    return await this.productItems.locator('.product-title a').allInnerTexts();
  }

  async addProductToCartByName(productName: string): Promise<void> {
    await test.step(`Add product "${productName}" to cart from catalog`, async () => {
      const productCard = this.productItems.filter({ hasText: productName }).first();
      await this.waitForElementState(productCard, 'visible');
      const addToCartBtn = productCard.getByRole('button', { name: 'Add to cart' });

      // Wait for backend cart API response when adding product
      await this.waitForApiResponse(
        (response) => response.url().includes('addproducttocart') && response.status() === 200,
        async () => {
          await addToCartBtn.click();
        }
      );

      await this.waitForElementState(this.notificationBar, 'visible');
      if (await this.isElementVisible(this.notificationCloseButton)) {
        await this.notificationCloseButton.click();
      }
      await this.waitForElementState(this.notificationBar, 'hidden', 5000).catch(() => {});
    });
  }

  async openProductByName(productName: string): Promise<void> {
    await test.step(`Open product details for "${productName}"`, async () => {
      const productCard = this.productItems.filter({ hasText: productName }).first();
      const productLink = productCard.getByRole('link', { name: productName }).first();
      await productLink.click();
    });
  }

  async getNotificationText(): Promise<string> {
    await this.notificationBar.waitFor({ state: 'visible' });
    return await this.getElementText(this.notificationBar);
  }

  // --- Locator Accessors for Web-First Assertions ---

  getPageTitleLocator(): Locator {
    return this.pageTitle;
  }
}
