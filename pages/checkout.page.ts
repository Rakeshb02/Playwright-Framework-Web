import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';

export interface BillingAddress {
  country: string;
  state?: string;
  city: string;
  address1: string;
  postalCode: string;
  phoneNumber: string;
}

export class CheckoutPage extends BasePage {
  // Billing
  private readonly billingSection: Locator;
  private readonly billingAddressSelect: Locator;
  private readonly billingCountryDropdown: Locator;
  private readonly billingStateDropdown: Locator;
  private readonly billingCityInput: Locator;
  private readonly billingAddress1Input: Locator;
  private readonly billingZipInput: Locator;
  private readonly billingPhoneInput: Locator;
  private readonly billingContinueBtn: Locator;

  // Shipping Address
  private readonly shippingAddressSelect: Locator;
  private readonly shippingContinueBtn: Locator;

  // Shipping Method
  private readonly shippingMethodContinueBtn: Locator;

  // Payment Method
  private readonly paymentMethodContinueBtn: Locator;

  // Payment Info
  private readonly paymentInfoContinueBtn: Locator;

  // Confirm Order
  private readonly confirmOrderBtn: Locator;

  // Success
  private readonly orderSuccessTitle: Locator;
  private readonly orderDetailsList: Locator;
  private readonly orderCompletedContinueBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Billing
    this.billingSection = page.locator('#opc-billing');
    this.billingAddressSelect = page.locator('#billing-address-select');
    this.billingCountryDropdown = page.locator('#BillingNewAddress_CountryId');
    this.billingStateDropdown = page.locator('#BillingNewAddress_StateProvinceId');
    this.billingCityInput = page.locator('#BillingNewAddress_City');
    this.billingAddress1Input = page.locator('#BillingNewAddress_Address1');
    this.billingZipInput = page.locator('#BillingNewAddress_ZipPostalCode');
    this.billingPhoneInput = page.locator('#BillingNewAddress_PhoneNumber');
    this.billingContinueBtn = page.locator('#billing-buttons-container').getByRole('button', { name: 'Continue' });

    // Shipping Address
    this.shippingAddressSelect = page.locator('#shipping-address-select');
    this.shippingContinueBtn = page.locator('#shipping-buttons-container').getByRole('button', { name: 'Continue' });

    // Shipping Method
    this.shippingMethodContinueBtn = page.locator('#shipping-method-buttons-container').getByRole('button', { name: 'Continue' });

    // Payment Method
    this.paymentMethodContinueBtn = page.locator('#payment-method-buttons-container').getByRole('button', { name: 'Continue' });

    // Payment Info
    this.paymentInfoContinueBtn = page.locator('#payment-info-buttons-container').getByRole('button', { name: 'Continue' });

    // Confirm Order
    this.confirmOrderBtn = page.locator('#confirm-order-buttons-container').getByRole('button', { name: 'Confirm' });

    // Completed
    this.orderSuccessTitle = page.getByText('Your order has been successfully processed!');
    this.orderDetailsList = page.getByText(/Order number:/i);
    this.orderCompletedContinueBtn = page.getByRole('button', { name: 'Continue' });
  }

  // --- Actions ---

  async fillBillingAddress(address: BillingAddress): Promise<void> {
    await test.step('Fill Billing Address', async () => {
      await this.waitForElementState(this.billingContinueBtn, 'visible', 15000);

      // If billing address select dropdown is visible, select 'New Address' to enter the scenario address
      if (await this.billingAddressSelect.isVisible()) {
        await this.selectDropdownOption(this.billingAddressSelect, 'New Address', 'Billing Address Select (New Address)');
      }

      await this.selectDropdownOption(this.billingCountryDropdown, address.country, 'Billing Country');
      
      // Auto-wait for state dropdown cascade
      if (address.state && (await this.billingStateDropdown.isVisible())) {
        await this.billingStateDropdown.locator('option').nth(1).waitFor({ state: 'attached' }).catch(() => {});
        await this.selectDropdownOption(this.billingStateDropdown, address.state, 'Billing State');
      }

      await this.fill(this.billingCityInput, address.city, 'Billing City');
      await this.fill(this.billingAddress1Input, address.address1, 'Billing Address 1');
      await this.fill(this.billingZipInput, address.postalCode, 'Billing Zip/Postal');
      await this.fill(this.billingPhoneInput, address.phoneNumber, 'Billing Phone');
      await this.click(this.billingContinueBtn, 'Billing Continue Button');
      await this.waitForSpinnerToDisappear();
    });
  }

  async confirmShippingAddress(): Promise<void> {
    await test.step('Confirm Shipping Address', async () => {
      await this.waitForElementState(this.shippingContinueBtn, 'visible', 15000);
      await this.click(this.shippingContinueBtn, 'Shipping Address Continue Button');
      await this.waitForSpinnerToDisappear();
    });
  }

  async selectShippingMethod(): Promise<void> {
    await test.step('Select Shipping Method', async () => {
      await this.waitForElementState(this.shippingMethodContinueBtn, 'visible', 15000);
      await this.click(this.shippingMethodContinueBtn, 'Shipping Method Continue Button');
      await this.waitForSpinnerToDisappear();
    });
  }

  async selectPaymentMethod(): Promise<void> {
    await test.step('Select Payment Method (Cash On Delivery)', async () => {
      await this.waitForElementState(this.paymentMethodContinueBtn, 'visible', 15000);
      await this.click(this.paymentMethodContinueBtn, 'Payment Method Continue Button');
      await this.waitForSpinnerToDisappear();
    });
  }

  async confirmPaymentInfo(): Promise<void> {
    await test.step('Confirm Payment Info', async () => {
      await this.waitForElementState(this.paymentInfoContinueBtn, 'visible', 15000);
      await this.click(this.paymentInfoContinueBtn, 'Payment Info Continue Button');
      await this.waitForSpinnerToDisappear();
    });
  }

  async confirmOrder(): Promise<void> {
    await test.step('Confirm Order', async () => {
      await this.waitForElementState(this.confirmOrderBtn, 'visible', 15000);
      await this.click(this.confirmOrderBtn, 'Confirm Order Button');
      await this.waitForSpinnerToDisappear();
    });
  }

  async getOrderSuccessTitle(): Promise<string> {
    await this.waitForElementState(this.orderSuccessTitle, 'visible', 20000);
    return await this.getElementText(this.orderSuccessTitle);
  }

  async getOrderDetails(): Promise<string> {
    await this.waitForElementState(this.orderDetailsList, 'visible', 10000);
    return await this.getElementText(this.orderDetailsList);
  }

  // --- Locator Accessors for Web-First Assertions ---

  getOrderSuccessTitleLocator(): Locator {
    return this.orderSuccessTitle;
  }

  getOrderDetailsLocator(): Locator {
    return this.orderDetailsList;
  }
}
