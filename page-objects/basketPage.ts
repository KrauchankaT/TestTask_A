import { Page, expect, Locator } from "@playwright/test";

interface BasketItem {
    itemLocator: Locator | null;
    itemName: string;
    itemPrice: number;
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
        await expect(this.popUpBasket).toHaveAttribute('aria-expanded', 'true', {timeout: 30000});
    }

    async openBasket (){
        await this.goToBasket.click();
        await expect(this.page).toHaveURL('/basket');
    }

    async checkCountItemsInBasket(count: string){
        
        const countItemsInBasket = this.page.locator('.basket-count-items')
        expect(countItemsInBasket).toHaveText(count, {timeout: 30000});
    }
    
        /**
     * You can click on the "Купить" button for the randomly selected item. 
     * @param itemLocator - Should be selector for promotional item or non-promotional item
     */
    
    async addRandomItemToBasket (itemLocator: any){
        
        const randomItem = this.page.locator(itemLocator);

        await this.page.waitForSelector(itemLocator, { state: 'visible' });

        const count = await randomItem.count();
        const randomIndex = Math.floor(Math.random() * (count-1));                 
        const promItem = randomItem.nth(randomIndex);
    
        await promItem.locator('.actionBuyProduct').click();
            
        await expect (promItem).toBeVisible();
        
        const itemName = await promItem.locator('.product_name')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
        

        const fullPrice = await promItem.locator('.product_price')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));

        const priceMatch = fullPrice.match(/[+-]?\d+/); 
        const itemPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;

        const itemDetails: BasketItem = {
            itemLocator: promItem,
            itemName: itemName,
            itemPrice: itemPrice
        };

        this.addedItems.push(itemDetails); 
        return this.addedItems;
        
    }   

    async addRandomPromotionalItemToBasket (){
        
        const promotionalItem = '.hasDiscount';
        return this.addRandomItemToBasket(promotionalItem);
  
    } 

    async addRandomNonPromotionalItemToBasket (){
        
        const nonPromotionalItem = '.note-item.card.h-100:not(.hasDiscount)';
        return this.addRandomItemToBasket(nonPromotionalItem);
  
    } 

    async addAnyRandomItemToBasket (){
        
        const anyRandomlItem = '.note-item.card.h-100';
        return this.addRandomItemToBasket(anyRandomlItem);
  
    }  

    async addTheSameItemToBasket (expectedItems: BasketItem[]): Promise<void>{
        for (const expectedItem of expectedItems) {
        // проверка на NULL
        if (expectedItem.itemLocator) {
            const buttonLocator = expectedItem.itemLocator
                .locator(`text=${expectedItem.itemName}`)
                .locator('xpath=../..')
                .locator('.actionBuyProduct');
            await buttonLocator.click(); 
        } else {
            console.error('itemLocator is null or undefined');
        }
        }
    }

    async checkDataInBasket(expectedItems: BasketItem[]) {
               
       this.checkPopupBasket()
       
       
        // Remove dash before price
        function normalizePrice(price: string): string {
        const cleanedPrice = price.replace(/р\./g, '').trim();
        return cleanedPrice.startsWith('-') ? cleanedPrice.slice(1).trim() : cleanedPrice;
        }

        console.log (expectedItems);

        // Chechk items in the basket
        for (const expectedItem of expectedItems) {
            const basketItem = this.page.locator(`.basket-item:has-text("${expectedItem.itemName}")`);
            await expect(basketItem).toBeVisible();
            
            const basketItemPrice = await basketItem.locator('.basket-item-price')
                .evaluate(el => el.textContent?.trim() || '');
            
            const normalizedPrice = normalizePrice(basketItemPrice);
            const count = await basketItem.locator('[class = "basket-item-count badge badge-primary ml-auto"]')
                .evaluate(el => el.textContent?.trim() || '');
            const finalPriceItem = expectedItem.itemPrice * Number(count);
            
            if (normalizedPrice !== String(finalPriceItem)) {
                throw new Error(`Цена товара ${expectedItem.itemName} не совпадает. Ожидалось: ${finalPriceItem}, Получено: ${normalizedPrice}`);
            } console.log(`Цена товара ${expectedItem.itemName} совпадает. Ожидалось: ${finalPriceItem}, Получено: ${normalizedPrice}`)
        }
    
        // Проверяем общую сумму
        const basketTotal = await this.page.locator('.ml-4.mt-4.mb-2 .basket_price')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
    
        console.log("Все проверки корзины успешно выполнены!");
    

   const totalPriceBasket = await this.page.locator('.ml-4.mt-4.mb-2 .basket_price')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
            
        const total = await this.calculateTotalPrice();
        const normalizedTotalPrice = normalizePrice(String(total));

        if (normalizedTotalPrice !== totalPriceBasket) {
            throw new Error(`Общая сумма не совпадает: ожидалось ${totalPriceBasket}, получено ${total}`);
        } console.log (`Общая сумма cовпадает: ожидалось ${totalPriceBasket}, получено ${total}`)
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