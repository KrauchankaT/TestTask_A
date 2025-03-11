import { Page, expect } from "@playwright/test";

export class BasketPage{

    readonly page:Page
   
    constructor(page: Page){
        this.page = page
    }
 
    //async clearCart(){
    //    await this.page.getByText('Корзина', { exact: true }).click();
    //    await this.page.getByRole('button', { name: 'Очистить корзину' }).click()
   // }

    async checkPopupBasket(){
        await this.page.locator('.basket_icon').click();
        const popupCart = this.page.locator('#dropdownBasket')
        await expect(popupCart).toHaveAttribute('aria-expanded', 'true');
    }

    // async checkDataInCart (){
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
        
        await expect (this.page.locator('.basket_icon')).toBeAttached(); // лучше эту проверку оставить тут или вынести в основной файл?
        //const productName = await randomPromotionalItem.nth(randomIndex).locator('.basket-item-title').innerText();
    }    

    async checkCountItemsInBasket(count: string){
        await this.page.waitForTimeout(5000)
        const cartCountItems = await this.page.locator('.basket-count-items').textContent();
        expect(cartCountItems).toEqual(count);
    }

    async openBasket (){
        await this.page.getByRole('button', { name: 'Перейти в корзину' }).click();
        await expect(this.page).toHaveURL('/basket');
    }
}