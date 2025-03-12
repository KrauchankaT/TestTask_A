import { test, expect } from '@playwright/test';
import { BasketPage } from '../page-objects/basketPage';
import { LoginPage } from '../page-objects/loginPage';
import { clearBasket } from '../utils/utils';


test.beforeEach(async ({ page, isMobile })  => {

    await page.goto('');
    await clearBasket(page);
;
  })
  
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
    // разобраться со всеми проблемами

    const nonPromotionalItem = '.note-item.card.h-100:not(.hasDiscount)';
    const ttt = new BasketPage(page);
    
    await page.waitForSelector('.note-item.card.h-100:not(.hasDiscount)', { state: 'visible' });
    await ttt.addRandomItemToBasket(nonPromotionalItem);
    await ttt.checkCountItemsInBasket('1');
    await ttt.checkPopupBasket();                                
    await ttt.openBasket();
  });
  
  // Тест-кейс 3. Переход в корзину с 1 акционным товаром.
  // Предусловие:
  // Пользователь авторизован в системе
  // Корзина пуста

  test('TK3. Go to cart with 1 promotional item', async ({page}) => {
    
    const ttt = new BasketPage(page);

    await page.waitForTimeout(5000);
    const promotionalItem = '.hasDiscount';

    await ttt.addRandomItemToBasket(promotionalItem);
    await ttt.checkCountItemsInBasket('1');

    //await page.waitForSelector('#dropdownBasket', { state: 'visible' });
    await ttt.checkPopupBasket();                                    // check BasketPopUp is opened
    await ttt.openBasket();
  });
  
    // Тест-кейс 4. Переход в корзину с 9 разными товарами.
  // Предусловие:
  // - Пользователь авторизован в системе
  // - Корзине 1 акционный товар !!!!

  test('TK4. Go to cart with 9 different items', async ({page}) => {
    
    const ttt = new BasketPage(page);

    let countItem = 1;

    while (countItem <= 9){

    //await page.waitForTimeout(5000)
    const anyItem = '.note-item';

    await ttt.addRandomItemToBasket(anyItem);
    countItem ++;
    }
   
    await page.waitForTimeout(5000)
    const basketCountItems = await page.locator('.basket-count-items').textContent();
    expect(basketCountItems).toEqual('9');
    await ttt.openBasket();
  })
 

    // Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования.
  // Предусловие:
  // Пользователь авторизован в системе
  // Корзина пуста

  
  test('TK5. Go to cart with 9 the same promotional items ', async({page}) => {
    
    const ttt = new BasketPage(page);

    await page.waitForTimeout(5000)
    const promotionalItem = '.hasDiscount';

    await ttt.addRandomItemToBasket(promotionalItem);         
    await ttt.openBasket();
    //const productName = await locator.nth(randomIndex).locator('.product_name').textContent



   // await locator.nth(randomIndex).locator('.actionBuyProduct').click(); 
     //const locator = page.locator('.product_name');
    //await locator.nth(randomIndex).locator('.actionBuyProduct').click();
    //const element = page.locator('text=/^Блокнот в точку/');
    //await page.locator('text=/^Блокнот в точку/').getByRole('button', {name: "Купить"}).click();
    //await expect(element).toBeVisible();

  })