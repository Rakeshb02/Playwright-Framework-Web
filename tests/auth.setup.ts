import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { RegisterPage } from '@pages/register.page';
import { HomePage } from '@pages/home.page';
import usersData from '@test-data/users.json';
import { allureDetails } from '@utils/allure-helper';
import fs from 'fs';
import path from 'path';

const authFile = path.resolve(__dirname, '../.auth/user.json');

setup('authenticate and cache storageState', async ({ page, context }) => {
  await allureDetails({
    parentSuite: 'Demo Web Shop Test Suite',
    suite: 'Infrastructure & Prerequisites',
    subSuite: 'Authentication Cache Setup',
    epic: 'Framework Infrastructure',
    feature: 'Session Storage Caching',
    story: 'Authenticate & Generate storageState',
    severity: 'trivial',
    tags: ['setup', 'infrastructure'],
    description: 'Global prerequisite setup: ensures all valid users exist in the Demo Web Shop database, logs in, and caches the clean session storageState.',
  });

  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);

  // 1. Delete previous storageState file to ensure no stale cookies carry over
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    console.log(`[AUTH SETUP] Deleted previous stale storageState file: ${authFile}`);
  }

  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // 2. Ensure all 4 valid users are registered on the demo site
  for (const user of usersData.validUsers) {
    await loginPage.open();
    await loginPage.login(user.email, user.password, false);

    const isLoginFailed = await page.locator('.validation-summary-errors').isVisible();
    if (isLoginFailed) {
      console.log(`[AUTH SETUP] User ${user.email} not registered yet. Registering user...`);
      await registerPage.open();
      await registerPage.registerUser({
        gender: 'male',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      });
      await homePage.clickLogout();
    } else {
      await homePage.clickLogout();
    }
  }

  // 3. Log in with primary user to cache storageState for downstream E2E tests
  const primaryUser = usersData.validUsers[0];
  await loginPage.open();
  await loginPage.login(primaryUser.email, primaryUser.password, true);

  await expect(homePage.getAccountLink()).toBeVisible({ timeout: 15000 });
  await expect(homePage.getAccountLink()).toContainText(primaryUser.email);

  // 4. Save clean storageState
  const rawState = await context.storageState();
  const currentEpochSeconds = Date.now() / 1000;

  const validCookies = rawState.cookies.filter((cookie) => {
    if (cookie.expires !== -1 && cookie.expires < currentEpochSeconds) {
      return false;
    }
    if (cookie.name.startsWith('__utm')) {
      return false;
    }
    return true;
  });

  const cleanStorageState = {
    cookies: validCookies,
    origins: rawState.origins,
  };

  fs.writeFileSync(authFile, JSON.stringify(cleanStorageState, null, 2), 'utf-8');
  console.log(
    `[AUTH SETUP] Saved clean storageState with ${validCookies.length} active cookies (${validCookies.map((c) => c.name).join(', ')}) to ${authFile}`
  );
});
