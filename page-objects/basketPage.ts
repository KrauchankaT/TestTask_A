import { Page, expect, Locator } from "@playwright/test";

interface BasketItem {
    itemlocator: Locator | null;
    itemName: string;
    itemPrice: string;
}

export class BasketPage{

    readonly page:Page
    readonly popUpBasket: Locator
    readonly goToBasket: Locator
    addedItems: BasketItem[] = [];

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

    async checkCountItemsInBasket(count: string){
        
        await this.page.waitForTimeout(5000)
        const basketCountItems = await this.page.locator('.basket-count-items').textContent();
        expect(basketCountItems).toEqual(count);
    }
    
        /**
     * You can click on the "Купить" button for the randomly selected item. 
     * @param locator - Should be selector for promotional item or non-promotional item
     */
    async addRandomItemToBasket (locator: any){
    
        const randomPromotionalItem = this.page.locator(locator);
        const count = await randomPromotionalItem.count();
        const randomIndex = Math.floor(Math.random() * (count-1));                 
        const promItem = randomPromotionalItem.nth(randomIndex);
    
        await promItem.locator('.actionBuyProduct').click();
            
        await expect (promItem).toBeVisible();
        const itemName = await promItem.locator('.product_name')
                .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
        const fullPrice = await promItem.locator('.product_price')
               .evaluate(el => (el.textContent ? el.textContent.trim() : ''));

        const firstPartOfPrice = fullPrice.match(/^\d+\sр\./);
        const itemPrice = firstPartOfPrice ? firstPartOfPrice[0] : '';    
        
        const itemDetails: BasketItem = {
            itemlocator: promItem,
            itemName: itemName,
            itemPrice: itemPrice
        };

        this.addedItems.push(itemDetails); // Сохранение данных о добавленном товаре
        return itemDetails;
       // return { promItem, itemName, itemPrice };    
    }   

   // async checkDataInBasket(expectedItem: { promItem: Locator; itemName: string; itemPrice: string }): Promise<void> {
    async checkDataInBasket(expectedItem: BasketItem): Promise<void> {

        
        await this.popUpBasket.click();
        await expect(this.popUpBasket).toHaveAttribute('aria-expanded', 'true');

        // Receive data from the basket
        const itemNameBasket = await this.page.locator('.basket-item-title')
               .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
       // const itemNameBasket = await this.page.locator('.basket-item-title').evaluateAll(elements =>
                //  elements.map(el => (el.textContent ? el.textContent.trim() : ''))
                // );
        // Сравниваем массив basketItems с данными из DOM
 //       this.addedItems.forEach((basketItem, index) => {
  //          if (itemNameBasket[0] !== expectedItem.itemName) {
 //                  throw new Error(`Название товара не совпадает: ожидалось "${expectedItem.itemName}", получено "${itemNameBasket}"`);
                          //    }
                       //  ;
            // if (!itemNameBasket.includes(basketItem.itemName)) {
            //     throw new Error(
            //         `Товар "${basketItem.itemName}" отсутствует в корзине, отображаемой на странице!`
            //     );
            //      } else {
                   
            //         
            // }
 //       });




        const itemPriceBasket = await this.page.locator('.basket-item-price')
                .evaluate(el => (el.textContent ? el.textContent.trim() : ''));

        // Verify data in the basket
        if (itemNameBasket !== expectedItem.itemName) {
            throw new Error(`Название товара не совпадает: ожидалось "${expectedItem.itemName}", получено "${itemNameBasket}"`);
             }
        
        // Remove dash before price
        function normalizePrice(price: string): string {
            const cleanedPrice = price.replace(/р\./g, '').trim();
            return cleanedPrice.startsWith('-') ? cleanedPrice.slice(1).trim() : cleanedPrice;
        }
        
        const normalizedPrice = normalizePrice(itemPriceBasket);
      
        const countItem = await this.page.locator('xpath=//*[@id="basketContainer"]/div[2]/ul/li/span[3]').textContent();
        const itemPrice = Number(expectedItem.itemPrice.replace(/\D/g, ''));
        const totalPriceForItem = String (Number(countItem) * itemPrice);
        //parseFloat(countItem.replace(/\D/g, '')); 

        //const count = Number(countItem);
        //const itemPrice = Number(expectedItem.itemPrice);

        if (normalizedPrice !== totalPriceForItem){
            throw new Error(`Цена товара не совпадает: ожидалось ${totalPriceForItem}, получено ${normalizedPrice}`);
             }

             
        // await this.page.waitForTimeout(5000)    
        const totalPriceBasket = await this.page.locator('.ml-4.mt-4.mb-2 .basket_price')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
            
        const total = await this.calculateTotalPrice();
        const normalizedTotalPrice = normalizePrice(String(total));

        if (normalizedTotalPrice !== totalPriceBasket) {
            throw new Error(`Общая сумма не совпадает: ожидалось ${totalPriceBasket}, получено ${total}`);
        }
    }

    async calculateTotalPrice(): Promise<number> {
        
        // Получить список всех элементов li, содержащих цены
        const prices = await this.page.locator('li .basket-item-price').evaluateAll(elements =>
            elements.map(el => {
                const text = el.textContent ? el.textContent.trim() : '';
                return parseFloat(text.replace(/[^\d.-]/g, '')); // Удаляет лишние символы, оставляя только цифры, точки и минусы
            })
        );
    
        // Сложить все цены
        const totalPrice = prices.reduce((sum, price) => sum + price, 0);
    
        return totalPrice;
    }   

}