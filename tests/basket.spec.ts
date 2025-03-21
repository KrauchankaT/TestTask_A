import { test, expect } from '@playwright/test';
import { BasketPage } from '../page-objects/basketPage';
import { clearBasket } from '../utils/utils';

test.describe('Tests with Empty Basket', () => {
test.beforeEach(async ({ page })  => {

    await page.goto('');
    await clearBasket(page);
  });
  
  // Тест-кейс 1. Переход в пустую корзину. Failed!
  // Предусловие: Пользователь авторизован в системе  +  Корзина пуста
 
  test('TK1. Go to Empty Basket', async ({page}) => {
    
    const emptyBasket = new BasketPage(page);
    
    await page.reload({ waitUntil: 'load' });
    await emptyBasket.checkPopupBasket();                                         
    await emptyBasket.openBasket();                                       
  });
  
  // Тест-кейс 2. Переход в корзину с 1 неакционным товаром.
  // Предусловие: Пользователь авторизован в системе + Корзина пуста

  test('TK2. Go to Basket with 1 non-promotional item', async ({page}) => {

    const oneNonPromItem = new BasketPage(page);
    const count = '1';
  
    const selectedItem = await oneNonPromItem.addRandomNonPromotionalItemToBasket();
    await oneNonPromItem.checkCountItemsInBasket(count);
    await oneNonPromItem.checkDataInBasket(selectedItem);
      
    await oneNonPromItem.openBasket();
  });
  
  // Тест-кейс 3. Переход в корзину с 1 акционным товаром.
  // Предусловие: Пользователь авторизован в системе + Корзина пуста

  test('TK3. Go to cart with 1 promotional item', async ({page}) => {
    
    const onePromItem = new BasketPage(page);
    const count = "1";

    const selectedItem = await onePromItem.addRandomPromotionalItemToBasket();
    await onePromItem.checkCountItemsInBasket(count);
    await onePromItem.checkDataInBasket(selectedItem);
    await onePromItem.openBasket();
  });
  
  // Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования.
  // Предусловие: Пользователь авторизован в системе + Корзина пуста
  
  test('TK5. Go to cart with 9 the same promotional items ', async({page}) => {
    
    const theSamePromItem = new BasketPage(page);
    const count = "3";
    
    const selectedItem = await theSamePromItem.addRandomPromotionalItemToBasket();

    let countItem = 1;
    while (countItem <= 2){
      await theSamePromItem.addTheSameItemToBasket(selectedItem);
      countItem++;
    }

    await theSamePromItem.checkCountItemsInBasket(count);
    await theSamePromItem.checkDataInBasket(selectedItem);
    await theSamePromItem.openBasket();
  });
});

test.describe('Tests with 1 item in Basket', () => {
  
  test.beforeEach(async ({ page })  => {
    await page.goto('');
    await clearBasket(page);

    const addItem = new BasketPage(page);
    await addItem.addRandomPromotionalItemToBasket();
  
  });

  // Тест-кейс 4. Переход в корзину с 9 разными товарами.
  // Предусловие: Пользователь авторизован в системе + Корзине 1 акционный товар

  test('TK4. Go to cart with 9 different items', async ({page}) => {
    
    const oneAnyItem = new BasketPage(page);
    const count = "5";
    
    await oneAnyItem.checkCountItemsInBasket('1');
    const selectedItem = await oneAnyItem.addAnyRandomItemToBasket();

    let countItem = 1;
    while (countItem <= 3){
      await oneAnyItem.addAnyRandomItemToBasket();
      countItem ++;
    }
   
  //  await page.waitForTimeout(5000)
    await oneAnyItem.checkCountItemsInBasket(count);
    await oneAnyItem.checkDataInBasket(selectedItem);
      
    await oneAnyItem.openBasket();
});
});