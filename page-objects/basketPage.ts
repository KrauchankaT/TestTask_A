import { Page, expect, Locator } from "@playwright/test";

export class BasketPage{

    readonly page:Page
    readonly popUpBasket: Locator
    readonly goToBasket: Locator

    constructor(page: Page){
        this.page = page;
        this.popUpBasket = this.page.locator('#dropdownBasket');
        this.goToBasket = this.page.getByRole('button', { name: 'Перейти в корзину' })
    }
 
    async checkPopupBasket(){
               
        await this.popUpBasket.click();
        await expect(this.popUpBasket).toHaveAttribute('aria-expanded', 'true');
    }

    async openBasket (){
        await this.goToBasket.click();
        await expect(this.page).toHaveURL('/basket');
    }

    // async checkDataInBasket (){
    //         // classproduct_name h6 mb-auto
        
    //       //  const productName = await this.page.locator('.basket-item-title').innerText();
    //       //  expect(productName).toContain('Название нужного товара');
          
    //         // Проверка стоимости товара
    //      //   const productPrice = await this.page.locator('.basket-item-price').innerText();
    //      //   expect(productPrice).toBe('442 р.)'
    //     // name locator ('.basket-item-title')
    //     //price locator ('..basket-item-price')
    //     //basket-item-count badge badge-primary ml-auto
    // }

    /**
     * You can click on the "Купить" button for the randomly selected item. 
     * @param locator - Should be selector for promotional item or non-promotional item
     */
    async addRandomItemToBasket (locator: any){
    
        const randomPromotionalItem = this.page.locator(locator);
        const count = await randomPromotionalItem.count();
        const randomIndex = Math.floor(Math.random() * count);                 
        await randomPromotionalItem.nth(randomIndex).locator('.actionBuyProduct').click();
        
        await expect (this.popUpBasket).toBeVisible(); 
        //const productName = await randomPromotionalItem.nth(randomIndex).locator('.basket-item-title').innerText();
    }    

    async checkCountItemsInBasket(count: string){
        
        await this.page.waitForTimeout(5000)
        const basketCountItems = await this.page.locator('.basket-count-items').textContent();
        expect(basketCountItems).toEqual(count);
    }


}