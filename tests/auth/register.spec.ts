import { test, expect, allureDetails } from '@fixtures/test.fixture';
import usersData from '@test-data/users.json';
import { DataHelper } from '@utils/data-helper';

test.describe('Authentication', () => {
  test.describe('User Registration', () => {
    test(
      usersData.newUserTemplate.description,
      { tag: usersData.newUserTemplate.tags.map((t) => `@${t}`) },
      async ({ registerPage, homePage }) => {
        await allureDetails({ tags: usersData.newUserTemplate.tags });

        const randomEmail = DataHelper.generateRandomEmail('playwright_user');
        const { newUserTemplate } = usersData;

        await test.step('Step 1: Open registration page', async () => {
          await registerPage.open();
        });

        await test.step('Step 2: Submit registration form and verify success message', async () => {
          await registerPage.registerUser({
            gender: newUserTemplate.gender as 'male' | 'female',
            firstName: newUserTemplate.firstName,
            lastName: newUserTemplate.lastName,
            email: randomEmail,
            password: newUserTemplate.password,
          });
          const successMessage = await registerPage.getSuccessMessage();
          expect(successMessage).toContain('Your registration completed');
        });

        await test.step('Step 3: Continue to store and verify user account is active', async () => {
          await registerPage.clickContinue();
          await expect(homePage.getAccountLink()).toBeVisible();
          await expect(homePage.getAccountLink()).toContainText(randomEmail);
        });
      }
    );
  });
});
