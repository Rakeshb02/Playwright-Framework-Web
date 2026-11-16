import { test as baseTest, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { HomePage } from '@pages/home.page';
import { LoginPage } from '@pages/login.page';
import { RegisterPage } from '@pages/register.page';
import { CatalogPage } from '@pages/catalog.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutPage } from '@pages/checkout.page';
import { allureDetails, AllureMetadata } from '@utils/allure-helper';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  catalogPage: CatalogPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = baseTest.extend<Pages & { autoAllure: void }>({
  // Auto-fixture: runs automatically for every test
  autoAllure: [
    async ({}, use, testInfo) => {
      // 1. Set global parent suite automatically across all tests
      await allure.parentSuite('Demo Web Shop Test Suite');

      // 2. Automatically derive suite, subSuite, epic, feature, story, severity
      // Example 1 (nested): ['file.ts', 'Authentication', 'Valid User Logins', 'testTitle']
      // Example 2 (hyphenated): ['file.ts', 'Authentication - Valid User Logins', 'testTitle']
      const describes = testInfo.titlePath.slice(1, -1);
      let suiteName = 'General Tests';
      let subSuiteName = 'Default';

      if (describes.length === 1) {
        const parts = describes[0].split(' - ');
        if (parts.length >= 2) {
          suiteName = parts[0].trim();
          subSuiteName = parts.slice(1).join(' - ').trim();
        } else {
          suiteName = describes[0].trim();
          subSuiteName = describes[0].trim();
        }
      } else if (describes.length >= 2) {
        suiteName = describes[0].trim();
        subSuiteName = describes[1].trim();
      }

      await allure.suite(suiteName);
      await allure.subSuite(subSuiteName);
      await allure.epic(suiteName);
      await allure.feature(subSuiteName);
      await allure.story(testInfo.title);
      await allure.severity(allure.Severity.NORMAL);

      await use();
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect, allureDetails, AllureMetadata };
