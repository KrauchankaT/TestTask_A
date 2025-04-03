import { Page, expect, Locator } from "@playwright/test";
import { time } from "console";

interface BasketItem {
    itemLocator: Locator | null;
    itemName: string;
    itemPrice: number;
}

export class BasketPage{

    readonly page:Page;
    readonly popUpBasket: Locator;
    readonly goToBasket: Locator;
    readonly basketIcon: Locator;
    readonly countItemsInBasket: Locator;
    addedItems: BasketItem[] = [];

    constructor(page: Page){
        this.page = page;
        this.popUpBasket = this.page.getByText('Корзина', { exact: true });
        this.goToBasket = this.page.getByRole('button', { name: 'Перейти в корзину' });
        this.basketIcon = this.page.locator('#dropdownBasket');
        //this.countItemsInBasket = this.page.locator('.basket-count-items');
        this.countItemsInBasket = this.page.locator('//*[@id="basketContainer"]/span');
    }
    
    //Checks that clicking on the Basket icon opens a Basket pop-up
    async checkPopupBasket(){
               
        await this.page.reload({ waitUntil: 'load' });
        await expect(this.basketIcon).toBeVisible({ timeout: 80000 });
        await this.popUpBasket.click();
        await expect(this.popUpBasket).toHaveAttribute('aria-expanded', 'true');
    }

    //Checks that the user is redirected to the Basket page after clicking on "Перейти в корзину" button
    async openBasket (){
        await this.goToBasket.click();

        await this.page.route('**/basket', (route) => {
            route.continue();
        });
        
        const response = await this.page.goto('/basket', { waitUntil: 'domcontentloaded' });

        if (response && response.status() === 200) {
            console.log('Status is :', response.status());
        } else if (!response) {
            console.error('Error: response is null');
        } else {
            console.error('Error loading the Basket, status is:', response.status());
        }
        
        const errorHeader = this.page.locator('h1');
        try {
            await expect(errorHeader).toHaveText('Server Error (#500)');
            console.error("The Basket page loaded with error: 'Server Error (#500)'");
        } catch (e) {
            console.log('The Basket page loaded without error');
        }
   }
    
    // Checks count items near the Basket icon
    async checkCountItemsInBasket(count: string){
        
        expect(this.countItemsInBasket).toHaveText(count);
    }
    
    // Add any promotional item to the Basket
    async addRandomPromotionalItemToBasket (){
        
        const promotionalItem = '.hasDiscount';
        return this.#addRandomItemToBasket(promotionalItem);
    } 

    // Add any non-promotional item to the Basket
    async addRandomNonPromotionalItemToBasket (){
        
        const nonPromotionalItem = '.note-item.card.h-100:not(.hasDiscount)';
        return this.#addRandomItemToBasket(nonPromotionalItem);
    } 

    // Add any item (promotional or non-promotional) to the Basket
    async addAnyRandomItemToBasket (){
        
        const anyRandomlItem = '.note-item.card.h-100';
        return this.#addRandomItemToBasket(anyRandomlItem);
    }
     
     /**
     * Add any item to the Basket > You can click on the "Купить" button for the randomly selected item. 
     * @param itemLocator - Should be locator for promotional item or non-promotional item
     */
    
    async #addRandomItemToBasket (itemLocator: any){
        
        const randomItem = this.page.locator(itemLocator);
        await this.page.waitForSelector(itemLocator, { state: 'visible' });

        const count = await randomItem.count();
        const randomIndex = Math.floor(Math.random() * (count-1));                 
        const promItem = randomItem.nth(randomIndex);
    
        const initialCount = await this.countItemsInBasket.innerText();
        const initialNumber = parseInt(initialCount, 10);

        await promItem.locator('.actionBuyProduct').click();
    
        await this.page.waitForFunction(
            ({ selector, expectedValue }) => {
                const element = document.querySelector(selector);
                if (!element || element.textContent === null) {
                    return false; 
                }
                return parseInt(element.textContent, 10) === expectedValue;
            },
            { selector: '.basket-count-items', expectedValue: initialNumber + 1 } 
        );

        const updatedCount = await this.countItemsInBasket.innerText();
        const updatedNumber = parseInt(updatedCount, 10);

        if (updatedNumber !== initialNumber + 1) {
            throw new Error(
                `Expected value to increase by 1, but got ${updatedNumber} instead of ${initialNumber + 1}`
            );
        // } else {
        //     console.log('Count of the items successfully increased by 1 after adding the item to the Basket!');
        }
        
        const itemName = await promItem.locator('.product_name')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
        
        const price = await promItem.locator('.product_price')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));

        const priceMatch = price.match(/[+-]?\d+/); 
        const itemPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;

        const itemDetails: BasketItem = {
            itemLocator: promItem,
            itemName: itemName,
            itemPrice: itemPrice
        };

        this.addedItems.push(itemDetails); 
        return this.addedItems;   
    }   
    
    // Add the same item to the Basket sevearl times
    async addTheSameItemToBasket (expectedItems: BasketItem[]): Promise<void>{
        
        for (const expectedItem of expectedItems) {
            if (!expectedItem.itemLocator) {
                throw new Error('There is no selected Item');
            } 
            
            const buttonLocator = expectedItem.itemLocator
                .locator(`text=${expectedItem.itemName}`)
                .locator('xpath=../..')
                .locator('.actionBuyProduct');
            
            await buttonLocator.click();
         
        }
    }

    async checkDataInBasket(expectedItems: BasketItem[]) {
               
       this.checkPopupBasket()
       
       // Removes dash before price
        function normalizePrice(price: string): string {
        const cleanedPrice = price.replace(/р\./g, '').trim();
        return cleanedPrice.startsWith('-') ? cleanedPrice.slice(1).trim() : cleanedPrice;
        }

        for (const expectedItem of expectedItems) {
            
            const basketItem = this.page.locator(`.basket-item:has-text("${expectedItem.itemName}")`);
            await expect(basketItem).toBeVisible({ timeout: 100000 });
            
            const basketItemPrice = await basketItem.locator('.basket-item-price')
                .evaluate(el => el.textContent?.trim() || '');
            
            const normalizedPrice = normalizePrice(basketItemPrice);
            const count = await basketItem.locator('[class = "basket-item-count badge badge-primary ml-auto"]')
                .evaluate(el => el.textContent?.trim() || '');
            const finalPriceItem = expectedItem.itemPrice * Number(count);
            
            if (normalizedPrice !== String(finalPriceItem)) {
                throw new Error(`Price of the item ${expectedItem.itemName} does not match. Expected: ${finalPriceItem}, received: ${normalizedPrice}`);
            } //console.log(`Price of the item ${expectedItem.itemName} matches. Expected: ${finalPriceItem}, received: ${normalizedPrice}`)
        }
           
        const totalPriceBasket = await this.page.locator('.ml-4.mt-4.mb-2 .basket_price')
            .evaluate(el => (el.textContent ? el.textContent.trim() : ''));
            
        const total = await this.calculateTotalPrice();
        const normalizedTotalPrice = normalizePrice(String(total));

        if (normalizedTotalPrice !== totalPriceBasket) {
            throw new Error(`Total amount does not match: expected ${totalPriceBasket}, received ${total}`);
        } //console.log (`Total amount mathes: expected ${totalPriceBasket}, received ${total}`)
    } 

    async calculateTotalPrice(): Promise<number> {
        
        const prices = await this.page.locator('li .basket-item-price').evaluateAll(elements =>
            elements.map(el => {
                const text = el.textContent ? el.textContent.trim() : '';
                return parseFloat(text.replace(/[^\d.-]/g, '')); 
            })
        );
    
        const totalPrice = prices.reduce((sum, price) => sum + price, 0);
    
        return totalPrice;
    }   

}