import { Locator, expect, Page } from "@playwright/test";

export class LoginPage{

    readonly page:Page
    readonly textBoxLogin: Locator
    readonly textBoxPassword: Locator
    readonly buttonInput: Locator

    constructor(page: Page){
        this.page = page;
        this.textBoxLogin = page.getByRole('textbox', { name: 'Логин' });
        this.textBoxPassword = page.getByRole('textbox', { name: 'Пароль' });
        this.buttonInput = page.getByRole('button', { name: 'Вход' });
    }
   
    /**
     * You can LogIn to the application using this method
     * @param login - should be login
     * @param password - should be password
     */
    async loginToApp (login: string, password: string) {
        await this.textBoxLogin.fill(login);
        await this.textBoxPassword.pressSequentially(password);    //
        await this.buttonInput.click();
        
        await expect(this.page.locator('#dropdownUser').locator('.text-uppercase')).toBeVisible({timeout: 20000});
    }
}