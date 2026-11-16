import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly cartRows: Locator;
  private readonly termsCheckbox: Locator;
  private readonly checkoutButton: Locator;
  private readonly orderTotal: Locator;
  private readonly removeCheckboxes: Locator;
  private readonly updateCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.cartRows = page.locator('table.cart tbody tr');
    this.termsCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.orderTotal = page.locator('.order-total strong');
    this.removeCheckboxes = page.locator('input[name="removefromcart"]');
    this.updateCartButton = page.getByRole('button', { name: 'Update shopping cart' });
  }

  // --- Actions ---

  async open(): Promise<void> {
    await this.navigateTo('/cart');
  }

  async clearCartIfNotEmpty(): Promise<void> {
    await this.open();
    const count = await this.removeCheckboxes.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await this.check(this.removeCheckboxes.nth(i), `Remove from cart checkbox #${i + 1}`);
      }
      await this.click(this.updateCartButton, 'Update shopping cart button');
    }
  }

  async getCartProductNames(): Promise<string[]> {
    await this.cartRows.first().waitFor({ state: 'visible' });
    const texts = await this.cartRows.locator('.product-name').allInnerTexts();
    return texts.map((t) => t.trim());
  }

  async acceptTermsAndCheckout(): Promise<void> {
    await this.check(this.termsCheckbox, 'Terms of service checkbox');
    await this.click(this.checkoutButton, 'Checkout button');
  }

  // --- Locator Accessors for Web-First Assertions ---

  getPageTitleLocator(): Locator {
    return this.pageTitle;
  }
}
