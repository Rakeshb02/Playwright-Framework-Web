import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email:');
    this.passwordInput = page.getByLabel('Password:');
    this.rememberMeCheckbox = page.getByLabel('Remember me?');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.locator('.validation-summary-errors');
  }

  // --- Actions ---

  async open(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad('domcontentloaded');
  }

  async login(email: string, password: string, rememberMe = true): Promise<void> {
    await this.fill(this.emailInput, email, 'Login Email');
    await this.fill(this.passwordInput, password, 'Login Password');
    if (rememberMe) {
      await this.check(this.rememberMeCheckbox, 'Remember Me Checkbox');
    }
    await this.click(this.loginButton, 'Log in button');
    await this.waitForPageLoad('domcontentloaded');
  }

  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  // --- Locator Accessors for Web-First Assertions ---

  getErrorMessageLocator(): Locator {
    return this.errorMessage;
  }
}
