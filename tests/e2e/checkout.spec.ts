import { test, expect, allureDetails } from '@fixtures/test.fixture';
import checkoutData from '@test-data/checkout.json';
import usersData from '@test-data/users.json';

test.describe('Sales & Checkout', () => {
  test.describe('Order Checkout', () => {
    // Execute scenarios serially so each completed purchase empties the cart cleanly
    test.describe.configure({ mode: 'serial' });

    for (const [index, scenario] of checkoutData.scenarios.entries()) {
      test(
        `[Checkout ${index + 1}] ${scenario.description}`,
        { tag: scenario.tags.map((t) => `@${t}`) },
        async ({
          homePage,
          catalogPage,
          cartPage,
          checkoutPage,
        }) => {
          test.slow();
          await allureDetails({ tags: scenario.tags });

          await test.step('Step 1: Open store and verify user is logged in', async () => {
            await homePage.open();
            await expect(homePage.getAccountLink()).toBeVisible();
            await expect(homePage.getAccountLink()).toContainText(usersData.validUser.email);
          });

          await test.step('Step 2: Clear shopping cart to ensure clean state', async () => {
            await cartPage.clearCartIfNotEmpty();
          });

          await test.step(`Step 3: Search and add ${scenario.products.length} product(s) to cart`, async () => {
            for (const [pIndex, product] of scenario.products.entries()) {
              await homePage.search(product.name);
              await catalogPage.addProductToCartByName(product.name);
              await homePage.waitForCartQuantity(pIndex + 1);
            }
          });

          await test.step('Step 4: Open shopping cart and verify products', async () => {
            await homePage.clickCart();
            const cartItems = await cartPage.getCartProductNames();
            expect(cartItems.length).toBe(scenario.products.length);
            for (const product of scenario.products) {
              expect(
                cartItems.some((cartItem) => cartItem.toLowerCase().includes(product.name.toLowerCase()))
              ).toBeTruthy();
            }
          });

          await test.step('Step 5: Accept terms and proceed to checkout', async () => {
            await cartPage.acceptTermsAndCheckout();
          });

          await test.step('Step 6: Fill checkout details and verify order is placed', async () => {
            await checkoutPage.fillBillingAddress(scenario.billingAddress);
            await checkoutPage.confirmShippingAddress();
            await checkoutPage.selectShippingMethod();
            await checkoutPage.selectPaymentMethod();
            await checkoutPage.confirmPaymentInfo();
            await checkoutPage.confirmOrder();

            const successTitle = await checkoutPage.getOrderSuccessTitle();
            expect(successTitle).toBe(scenario.orderConfirmationMessage);

            const orderDetails = await checkoutPage.getOrderDetails();
            expect(orderDetails).toContain('Order number:');
          });
        }
      );
  }
});
});
