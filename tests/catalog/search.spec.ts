import { test, expect, allureDetails } from '@fixtures/test.fixture';
import productsData from '@test-data/products.json';

test.describe('Catalog & Browsing', () => {
  test.describe('Product Search', () => {
    productsData.searchProducts.forEach((product, index) => {
      test(
        `[Product ${index + 1}] ${product.description}`,
        { tag: product.tags.map((t) => `@${t}`) },
        async ({ homePage, catalogPage }) => {
          await allureDetails({ tags: product.tags });

          await test.step('Step 1: Open home page', async () => {
            await homePage.open();
          });

          await test.step(`Step 2: Search for "${product.keyword}" and verify results`, async () => {
            await homePage.search(product.keyword);
            const titles = await catalogPage.getProductTitles();
            expect(titles.length).toBeGreaterThan(0);
            expect(
              titles.some((title) => title.toLowerCase().includes(product.keyword.toLowerCase()))
            ).toBeTruthy();
          });
        }
      );
    });
  });
});
