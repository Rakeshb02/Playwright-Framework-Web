import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';

export class WishlistPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly wishlistRows: Locator;
  private readonly removeCheckboxes: Locator;
  private readonly addToCartCheckboxes: Locator;
  private readonly updateWishlistButton: Locator;
  private readonly addToCartButton: Locator;
  private readonly emptyWishlistMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.wishlistRows = page.locator('table.cart tbody tr');
    this.removeCheckboxes = page.locator('table.cart input[name="removefromcart"]');
    this.addToCartCheckboxes = page.locator('table.cart input[name="addtocart"]');
    this.updateWishlistButton = page.getByRole('button', { name: 'Update wishlist' });
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.emptyWishlistMessage = page.getByText('The wishlist is empty!');
  }

  // --- Actions ---

  async open(): Promise<void> {
    await this.navigateTo('/wishlist');
  }

  async clearWishlistIfNotEmpty(): Promise<void> {
    await test.step('Clear wishlist if not empty', async () => {
      await this.open();
      const checkboxes = await this.removeCheckboxes.all();
      if (checkboxes.length > 0) {
        for (const [index, checkbox] of checkboxes.entries()) {
          await this.check(checkbox, `Remove from wishlist checkbox #${index + 1}`);
        }
        await this.click(this.updateWishlistButton, 'Update wishlist button');
        await this.emptyWishlistMessage.waitFor({ state: 'visible' });
      }
    });
  }

  async getWishlistProductNames(): Promise<string[]> {
    if (await this.isElementVisible(this.emptyWishlistMessage)) {
      return [];
    }
    await this.wishlistRows.first().waitFor({ state: 'visible' });
    const texts = await this.wishlistRows.locator('td.product a').allInnerTexts();
    return texts.map((t) => t.trim());
  }

  private async checkRemoveForProduct(productName: string): Promise<void> {
    const row = this.wishlistRows.filter({ hasText: productName }).first();
    const removeCheckbox = row.locator('input[name="removefromcart"]');
    await this.check(removeCheckbox, `Remove checkbox for "${productName}"`);
  }

  async removeProductByName(productName: string): Promise<void> {
    await test.step(`Remove "${productName}" from wishlist`, async () => {
      await this.checkRemoveForProduct(productName);
      await this.click(this.updateWishlistButton, 'Update wishlist button');
    });
  }

  async removeProductsByNames(productNames: string[]): Promise<void> {
    await test.step(`Remove ${productNames.length} product(s) from wishlist`, async () => {
      for (const productName of productNames) {
        await this.checkRemoveForProduct(productName);
      }
      await this.click(this.updateWishlistButton, 'Update wishlist button');
    });
  }

  async getEmptyWishlistMessage(): Promise<string> {
    return await this.getElementText(this.emptyWishlistMessage);
  }

  async isWishlistEmpty(): Promise<boolean> {
    return await this.isElementVisible(this.emptyWishlistMessage);
  }

  // --- Locator Accessors for Web-First Assertions ---

  getPageTitleLocator(): Locator {
    return this.pageTitle;
  }

  getWishlistRowsLocator(): Locator {
    return this.wishlistRows;
  }

  getWishlistItemRowLocator(productName: string): Locator {
    return this.wishlistRows.filter({ hasText: productName }).first();
  }

  getEmptyWishlistMessageLocator(): Locator {
    return this.emptyWishlistMessage;
  }

  getUpdateWishlistButtonLocator(): Locator {
    return this.updateWishlistButton;
  }

  getAddToCartButtonLocator(): Locator {
    return this.addToCartButton;
  }

  getAddToCartCheckboxesLocator(): Locator {
    return this.addToCartCheckboxes;
  }
}
