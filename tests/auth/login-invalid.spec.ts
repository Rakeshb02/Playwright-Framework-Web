import { test, expect, allureDetails } from '@fixtures/test.fixture';
import usersData from '@test-data/users.json';

test.describe('Authentication', () => {
  test.describe('Invalid User Logins', () => {
    usersData.invalidUsers.forEach((user, index) => {
      test(
        `[Invalid ${index + 1}] ${user.description}`,
        { tag: user.tags.map((t) => `@${t}`) },
        async ({ loginPage }) => {
          await allureDetails({ tags: user.tags });

          await test.step('Step 1: Open login page', async () => {
            await loginPage.open();
          });

          await test.step('Step 2: Submit invalid credentials and verify error message', async () => {
            await loginPage.login(user.email, user.password);
            const errorMessage = await loginPage.getErrorMessage();
            expect(errorMessage).toContain(user.expectedError);
          });
        }
      );
    });
  });
});
