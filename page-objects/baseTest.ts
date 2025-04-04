import { test as base } from '@playwright/test';
import { LoginPage } from './loginPage';

// Specify both option and fixture types.
export const test = base.extend<{loginPage: LoginPage}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);    
    },
});

export { expect } from '@playwright/test';