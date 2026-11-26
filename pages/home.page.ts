import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly logoutLink: Locator;
  private readonly cartLink: Locator;
  private readonly wishlistLink: Locator;
  private readonly accountLink: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly topMenu: Locator;
  private readonly booksMenuLink: Locator;
  private readonly cartQtyBadge: Locator;
  private readonly wishlistQtyBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
    this.cartLink = page.locator('#topcartlink').getByRole('link', { name: /Shopping cart/i });
    this.wishlistLink = page.locator('.header-links').getByRole('link', { name: /Wishlist/i });
    this.accountLink = page.locator('.header-links a.account');
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('.search-box').getByRole('button', { name: 'Search' });
    this.topMenu = page.locator('.top-menu');
    this.booksMenuLink = this.topMenu.getByRole('link', { name: 'Books', exact: true });
    this.cartQtyBadge = page.locator('#topcartlink .cart-qty');
    this.wishlistQtyBadge = page.locator('.header-links .wishlist-qty');
  }

  // --- Actions ---

  async open(): Promise<void> {
    await this.navigateTo('/');
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginLink, 'Login Link');
  }

  async clickRegister(): Promise<void> {
    await this.click(this.registerLink, 'Register Link');
  }

  async clickCart(): Promise<void> {
    await this.click(this.cartLink, 'Shopping Cart Link');
  }

  async clickWishlist(): Promise<void> {
    await this.click(this.wishlistLink, 'Wishlist Link');
  }

  async clickLogout(): Promise<void> {
    await this.click(this.logoutLink, 'Logout Link');
  }

  async search(keyword: string): Promise<void> {
    await this.fill(this.searchInput, keyword, 'Search input');
    await this.click(this.searchButton, 'Search button');
  }

  async goToBooksCategory(): Promise<void> {
    await this.click(this.booksMenuLink, 'Books menu category');
  }

  async goToCategory(categoryName: string): Promise<void> {
    await this.click(
      this.topMenu.getByRole('link', { name: categoryName, exact: true }),
      `${categoryName} menu category`
    );
  }

  async getWishlistCountText(): Promise<string> {
    return await this.getElementText(this.wishlistQtyBadge);
  }

  async getLoggedInUserEmail(): Promise<string> {
    return await this.getElementText(this.accountLink);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.logoutLink);
  }

  // --- Locator Accessors for Web-First Assertions ---

  getAccountLink(): Locator {
    return this.accountLink;
  }

  getLogoutLink(): Locator {
    return this.logoutLink;
  }

  getWishlistLink(): Locator {
    return this.wishlistLink;
  }

  getWishlistQtyLocator(): Locator {
    return this.wishlistQtyBadge;
  }
}
