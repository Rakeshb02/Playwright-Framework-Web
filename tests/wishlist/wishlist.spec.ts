import { test, expect, allureDetails } from '@fixtures/test.fixture';
import wishlistData from '@test-data/wishlist.json';
import usersData from '@test-data/users.json';

test.describe('Wishlist Management', () => {
  test.describe('Add & Remove Wishlist Items', () => {
    // Execute serially because wishlist mutates shared server-side account state
    test.describe.configure({ mode: 'serial' });

    test.afterEach(async ({ wishlistPage }) => {
      await wishlistPage.clearWishlistIfNotEmpty();
    });

    for (const [index, scenario] of wishlistData.scenarios.entries()) {
      test(
        `[Wishlist ${index + 1}] ${scenario.description}`,
        { tag: scenario.tags.map((t) => `@${t}`) },
        async ({ homePage, catalogPage, wishlistPage }) => {
          await allureDetails({ tags: scenario.tags });

          await test.step('Step 1: Open store and verify user is logged in', async () => {
            await homePage.open();
            await expect(homePage.getAccountLink()).toBeVisible();
            await expect(homePage.getAccountLink()).toContainText(usersData.validUser.email);
          });

          await test.step('Step 2: Clear wishlist to ensure a clean starting state', async () => {
            await wishlistPage.clearWishlistIfNotEmpty();
            await expect(wishlistPage.getEmptyWishlistMessageLocator()).toBeVisible();
            await expect(wishlistPage.getEmptyWishlistMessageLocator()).toContainText(
              wishlistData.expectedEmptyMessage
            );
            await expect(homePage.getWishlistQtyLocator()).toHaveText(
              wishlistData.expectedEmptyCountText
            );
          });

          await test.step(`Step 3: Add ${scenario.products.length} product(s) to the wishlist`, async () => {
            for (const product of scenario.products) {
              await homePage.goToCategory(product.category);
              await catalogPage.addProductToWishlistByName(product.name);

              await expect(catalogPage.getNotificationBarLocator()).toBeVisible();
              await expect(catalogPage.getNotificationBarLocator()).toContainText(
                wishlistData.expectedNotificationText
              );
              await expect(homePage.getWishlistQtyLocator()).toHaveText(
                product.expectedWishlistCountAfterAdd
              );

              await catalogPage.dismissNotification();
            }
          });

          await test.step('Step 4: Open wishlist and verify all added products are displayed', async () => {
            await homePage.clickWishlist();
            await expect(wishlistPage.getPageTitleLocator()).toHaveText(
              wishlistData.expectedWishlistPageTitle
            );
            await expect(wishlistPage.getWishlistRowsLocator()).toHaveCount(
              scenario.products.length
            );

            for (const product of scenario.products) {
              await expect(wishlistPage.getWishlistItemRowLocator(product.name)).toBeVisible();
            }
          });

          let nextStep = 5;

          if (scenario.partialRemoval) {
            const {
              removeProduct,
              remainingProducts,
              expectedWishlistCountAfterRemoval,
            } = scenario.partialRemoval;

            await test.step(
              `Step ${nextStep++}: Remove "${removeProduct}" and verify remaining item(s) and count`,
              async () => {
                await wishlistPage.removeProductByName(removeProduct);

                await expect(wishlistPage.getWishlistItemRowLocator(removeProduct)).toBeHidden();
                await expect(wishlistPage.getWishlistRowsLocator()).toHaveCount(
                  remainingProducts.length
                );
                for (const remainingProduct of remainingProducts) {
                  await expect(
                    wishlistPage.getWishlistItemRowLocator(remainingProduct)
                  ).toBeVisible();
                }
                await expect(homePage.getWishlistQtyLocator()).toHaveText(
                  expectedWishlistCountAfterRemoval
                );
              }
            );
          }

          await test.step(
            `Step ${nextStep}: Remove remaining product(s) and verify empty wishlist state`,
            async () => {
              await wishlistPage.removeProductsByNames(scenario.finalRemovalProducts);

              await expect(wishlistPage.getEmptyWishlistMessageLocator()).toBeVisible();
              await expect(wishlistPage.getEmptyWishlistMessageLocator()).toContainText(
                wishlistData.expectedEmptyMessage
              );
              await expect(wishlistPage.getWishlistRowsLocator()).toHaveCount(0);
              await expect(homePage.getWishlistQtyLocator()).toHaveText(
                wishlistData.expectedEmptyCountText
              );
            }
          );
        }
      );
    }
  });
});
