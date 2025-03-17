import { test, expect } from '@playwright/test';
import { BasketPage } from '../page-objects/basketPage';
import { LoginPage } from '../page-objects/loginPage';
import { clearBasket } from '../utils/utils';

test.describe('Tests with Empty Basket', () => {
test.beforeEach(async ({ page, isMobile })  => {

    await page.goto('');
    await clearBasket(page);
  });
  
  // Тест-кейс 1. Переход в пустую корзину. Failed!
  // Предусловие:
  // - Пользователь авторизован в системе
  // - Корзина пуста
 
  test('TK1. Go to Empty Basket', async ({page}) => {
    
    const emptyBasket = new BasketPage(page);
    
    await emptyBasket.checkPopupBasket();                                 
    await emptyBasket.openBasket();                                       
  });
  
  // Тест-кейс 2. Переход в корзину с 1 неакционным товаром.
  // Предусловие:
  // - Пользователь авторизован в системе
  // - Корзина пуста

  test('TK2. Go to Basket with 1 non-promotional item', async ({page}) => {

    const oneNonPromItem = new BasketPage(page);

    const nonPromotionalItem = '.note-item.card.h-100:not(.hasDiscount)';
    const count = '1';

    await page.waitForSelector(nonPromotionalItem, { state: 'visible' });
    
    const selectedItem = await oneNonPromItem.addRandomItemToBasket(nonPromotionalItem);
    await oneNonPromItem.checkCountItemsInBasket(count);
    await oneNonPromItem.checkDataInBasket(selectedItem);
      
    await oneNonPromItem.openBasket();
  });
  
  // Тест-кейс 3. Переход в корзину с 1 акционным товаром.
  // Предусловие:
  // Пользователь авторизован в системе
  // Корзина пуста

  test('TK3. Go to cart with 1 promotional item', async ({page}) => {
    
    const onePromItem = new BasketPage(page);

    const promotionalItem = '.hasDiscount';
    const count = "1";

    await page.waitForSelector(promotionalItem, {state: 'visible'});
    const selectedItem = await onePromItem.addRandomItemToBasket(promotionalItem);
    await onePromItem.checkCountItemsInBasket(count);
    await onePromItem.checkDataInBasket(selectedItem);
    await onePromItem.openBasket();
  });
  
  // Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования.
  // Предусловие:
  // Пользователь авторизован в системе
  // Корзина пуста

  
  test('TK5. Go to cart with 9 the same promotional items ', async({page}) => {
    
    const theSamePromItem = new BasketPage(page);

    const count = "9";
    const anyPromItem = '.hasDiscount';
    await page.waitForSelector(anyPromItem, { state: 'visible' });
    const { promItem, itemName, itemPrice } = await theSamePromItem.addRandomItemToBasket(anyPromItem);

    let countItem = 1;
    while (countItem <= 8){
      const buttonLocator = await promItem.locator(`text=${itemName}`).locator('xpath=../..').locator('.actionBuyProduct').click();
      await page.waitForTimeout(3000);
      countItem ++;
    }

    //await page.waitForTimeout(5000)
    await theSamePromItem.checkCountItemsInBasket(count);
    await theSamePromItem.openBasket();
  });
});

test.describe('Tests with Empty Basket', () => {
  
  test.beforeEach(async ({ page, isMobile })  => {
    await page.goto('');
    await clearBasket(page);

    const addItem = new BasketPage(page);
    const promotionalItem = '.hasDiscount';
    await addItem.addRandomItemToBasket(promotionalItem);
    

  });

  //   // Тест-кейс 4. Переход в корзину с 9 разными товарами.
  // // Предусловие:
  // // - Пользователь авторизован в системе
  // // - Корзине 1 акционный товар 
  test('TK4. Go to cart with 9 different items', async ({page}) => {
    
    const oneAnyItem = new BasketPage(page);
    
    const count = "9";
    const anyItem = '.note-item.card.h-100';
    await page.waitForSelector(anyItem, { state: 'visible' });
    await oneAnyItem.checkCountItemsInBasket('1');

    let countItem = 1;
    while (countItem <= 8){
      await oneAnyItem.addRandomItemToBasket(anyItem);
      countItem ++;
    }
   
    await page.waitForTimeout(5000)
    await oneAnyItem.checkCountItemsInBasket(count);
    //await oneAnyItem.checkDataInBasket(selectedItem);
      
    await oneAnyItem.openBasket();
});
});