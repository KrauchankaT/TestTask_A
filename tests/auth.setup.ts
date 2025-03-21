import {test} from '../page-objects/baseTest';
import path from 'path';
const authFile = path.join(__dirname, '../auth/user.json');
const fs = require('fs');
const credentialsPath = path.join(__dirname, '../data', 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

test('authenticate', async ({ loginPage, page }, testInfo) => {

    const username = credentials.username;
    const password = credentials.password;

    await page.goto('/login', { waitUntil: 'load' });
   
    // Perform authentication steps.
    await loginPage.loginToApp(username, password)
    await page.context().storageState({ path: authFile });
    }); 