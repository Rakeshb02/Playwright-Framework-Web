import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly productItems: Locator;
  private readonly notificationBar: Locator;
  private readonly notificationCloseButton: Locator;
  private readonly notificationWishlistLink: Locator;
  private readonly addToWishlistButton: Locator;
  private readonly productQuantityInput: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.productItems = page.locator('.product-item');
    this.notificationBar = page.locator('#bar-notification');
    this.notificationCloseButton = page.locator('#bar-notification span.close');
    this.notificationWishlistLink = this.notificationBar.getByRole('link', { name: 'wishlist' });
    this.addToWishlistButton = page.getByRole('button', { name: 'Add to wishlist' });
    this.productQuantityInput = page.getByLabel('Qty:');
  }

  // --- Actions ---

  async getPageTitleText(): Promise<string> {
    return await this.getElementText(this.pageTitle);
  }

  async getProductTitles(): Promise<string[]> {
    await this.productItems.first().waitFor({ state: 'visible' });
    return await this.productItems.locator('.product-title a').allInnerTexts();
  }

  async addProductToCartByName(productName: string): Promise<void> {
    await test.step(`Add product "${productName}" to cart from catalog`, async () => {
      const productCard = this.productItems.filter({ hasText: productName }).first();
      await productCard.waitFor({ state: 'visible' });
      const addToCartBtn = productCard.getByRole('button', { name: 'Add to cart' });
      await addToCartBtn.click();
      await this.notificationBar.waitFor({ state: 'visible' });
      if (await this.isElementVisible(this.notificationCloseButton)) {
        await this.notificationCloseButton.click();
      }
      await this.notificationBar.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    });
  }

  async openProductByName(productName: string): Promise<void> {
    await test.step(`Open product details for "${productName}"`, async () => {
      const productCard = this.productItems.filter({ hasText: productName }).first();
      const productLink = productCard.getByRole('link', { name: productName }).first();
      await this.click(productLink, `Product link "${productName}"`);
    });
  }

  async addToWishlist(quantity?: string): Promise<void> {
    await test.step('Add current product to wishlist', async () => {
      if (quantity !== undefined) {
        await this.fill(this.productQuantityInput, quantity, 'Product Quantity');
      }
      await this.click(this.addToWishlistButton, 'Add to wishlist button');
      await this.notificationBar.waitFor({ state: 'visible' });
    });
  }

  async addProductToWishlistByName(
    productName: string,
    dismissNotification = false
  ): Promise<void> {
    await test.step(`Add product "${productName}" to wishlist`, async () => {
      await this.openProductByName(productName);
      await this.addToWishlist();
      if (dismissNotification) {
        await this.dismissNotification();
      }
    });
  }

  async dismissNotification(): Promise<void> {
    if (await this.isElementVisible(this.notificationCloseButton)) {
      await this.click(this.notificationCloseButton, 'Close notification bar');
    }
    await this.notificationBar.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async clickNotificationWishlistLink(): Promise<void> {
    await this.notificationBar.waitFor({ state: 'visible' });
    await this.click(this.notificationWishlistLink, 'Notification wishlist link');
  }

  async getNotificationText(): Promise<string> {
    await this.notificationBar.waitFor({ state: 'visible' });
    return await this.getElementText(this.notificationBar);
  }

  // --- Locator Accessors for Web-First Assertions ---

  getPageTitleLocator(): Locator {
    return this.pageTitle;
  }

  getAddToWishlistButtonLocator(): Locator {
    return this.addToWishlistButton;
  }

  getNotificationBarLocator(): Locator {
    return this.notificationBar;
  }
}
