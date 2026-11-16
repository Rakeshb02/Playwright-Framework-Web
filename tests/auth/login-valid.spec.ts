import { test, expect, allureDetails } from '@fixtures/test.fixture';
import usersData from '@test-data/users.json';

test.describe('Authentication', () => {
  test.describe('Valid User Logins', () => {
    usersData.validUsers.forEach((user, index) => {
      test(
        `[Valid ${index + 1}] ${user.description}`,
        { tag: user.tags.map((t) => `@${t}`) },
        async ({
          homePage,
          loginPage,
        }) => {
          await allureDetails({ tags: user.tags });

          await test.step('Step 1: Open login page', async () => {
            await loginPage.open();
          });

          await test.step('Step 2: Log in and verify user account is displayed', async () => {
            await loginPage.login(user.email, user.password);
            await expect(homePage.getAccountLink()).toBeVisible();
            await expect(homePage.getAccountLink()).toContainText(user.email);
            await expect(homePage.getLogoutLink()).toBeVisible();
          });

          await test.step('Step 3: Log out and verify session is closed', async () => {
            await homePage.clickLogout();
            await expect(homePage.getAccountLink()).toBeHidden();
          });
        }
      );
    });
  });
});
