import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface RegistrationData {
  gender?: 'male' | 'female';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class RegisterPage extends BasePage {
  private readonly genderMaleRadio: Locator;
  private readonly genderFemaleRadio: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly resultMessage: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.genderMaleRadio = page.getByLabel('Male', { exact: true });
    this.genderFemaleRadio = page.getByLabel('Female', { exact: true });
    this.firstNameInput = page.getByLabel('First name:');
    this.lastNameInput = page.getByLabel('Last name:');
    this.emailInput = page.getByLabel('Email:');
    this.passwordInput = page.getByLabel('Password:', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm password:');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.resultMessage = page.locator('.result');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  // --- Actions ---

  async open(): Promise<void> {
    await this.navigateTo('/register');
  }

  async registerUser(data: RegistrationData): Promise<void> {
    if (data.gender === 'female') {
      await this.check(this.genderFemaleRadio, 'Gender Female radio');
    } else {
      await this.check(this.genderMaleRadio, 'Gender Male radio');
    }

    await this.fill(this.firstNameInput, data.firstName, 'First Name input');
    await this.fill(this.lastNameInput, data.lastName, 'Last Name input');
    await this.fill(this.emailInput, data.email, 'Email input');
    await this.fill(this.passwordInput, data.password, 'Password input');
    await this.fill(this.confirmPasswordInput, data.password, 'Confirm Password input');
    await this.click(this.registerButton, 'Register button');
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.resultMessage);
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueButton, 'Register Continue button');
  }

  // --- Locator Accessors for Web-First Assertions ---

  getResultMessageLocator(): Locator {
    return this.resultMessage;
  }
}
