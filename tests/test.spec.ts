import { test, expect } from '@playwright/test';
//import { request } from 'http';

test.beforeEach(async ({ page }) => {
  //залогиниться
    await page.goto('/login');
    const loginField = page.getByRole('textbox', { name: 'Логин' });
    const passwordField = page.getByRole('textbox', { name: 'Пароль' });

    await loginField.fill('test');
    await passwordField.pressSequentially('test');   //уточнить про импользование pressSequentially
    //await passwordField.fill('test'); разобраться почему тут ошибка
    await page.getByRole('button', { name: 'Вход' }).click();
  })
  
  test.beforeEach(async ({ page }) => {
  //почистить корзину
    await page.getByText('Корзина', { exact: true }).click();
    await page.getByRole('button', { name: 'Очистить корзину' }).click();
  });

  // Тест-кейс 1. Переход в пустую корзину.  ///!!!! Разобратться что делать, не открывается корзина, если она пустая
  // Предусловие:
  // - Пользователь авторизован в системе
  // - Корзина пуста

  test('TK1. Go to Empty cart', async ({page}) => {
    await page.getByText('Корзина', { exact: true }).click();
    await page.getByRole('button', { name: 'Перейти в корзину' }).click();
    // Ожидание перехода на URL страницы корзины
    await page.waitForURL('/basket');
  // Проверка, что страница успешно загрузилась
    await expect(page).toHaveURL('/basket');
    // при попытке  нажать на кнопку ошибка в devtoolsб что с этим делать!!!
  });

  // Тест-кейс 2. Переход в корзину с 1 неакционным товаром.
  // Предусловие:
  // - Пользователь авторизован в системе
  // - Корзина пуста
  test('TK2. Go to cart with 1 non-promotional item', async ({page}) => {
    // надо найти товар без акции!!!! и нажать кнопку Купить для него 
    // разобраться со всеми проблемами
    await page.waitForSelector('.note-item.card.h-100', { state: 'visible' });
    await page.locator('.note-item.card.h-100').first().click();
    await page.locator('.actionBuyProduct').first().click();
    await page.getByText('Корзина', { exact: true }).click();
    await page.getByRole('button', { name: 'Очистить корзину' }).click();
  });

  // Тест-кейс 3. Переход в корзину с 1 акционным товаром.
  // Предусловие:
  // Пользователь авторизован в системе
  // Корзина пуста

  test('TK3. Go to cart with 1 promotional item', async ({page}) => {
    
    const randomPromotionalItem = page.locator('.hasDiscount');
    const count = await randomPromotionalItem.count();
    const randomIndex = Math.floor(Math.random() * count);                  //Выбор случайного акционного элемента
    await randomPromotionalItem.nth(randomIndex).locator('.actionBuyProduct').click();
  //  await locator.nth(randomIndex).getByRole('button', {name: "Купить"}).click();
    await expect(page.locator('#basketContainer')).toBeVisible({ timeout: 20000 });       
    //понять почему находится ноль, хотя значение стало 1
    //expect(page.locator('.basket-count-items')).toHaveText('1');
   await page.waitForTimeout(5000)
   const basketCountItems = await page.locator('.basket-count-items').textContent();
   expect(basketCountItems).toEqual('1');
  });

  // Тест-кейс 4. Переход в корзину с 9 разными товарами.
  // Предусловие:
  // - Пользователь авторизован в системе
  // - Корзине 1 акционный товар

  test('TK4. Go to cart with 9 different items', async ({page}) => {
    
    let countItem = 1;

    while (countItem <= 9){
    const locator = page.locator('.note-item');
    const count = await locator.count();
    const randomIndex = Math.floor(Math.random() * count);           //Выбор случайного элемента
   // await locator.nth(randomIndex).locator('.actionBuyProduct').click();
    await locator.nth(randomIndex).getByRole('button', {name: "Купить"}).click();
    countItem ++;
    }
   
    await page.waitForTimeout(5000)
    const basketCountItems = await page.locator('.basket-count-items').textContent();
    expect(basketCountItems).toEqual('9');
  })


  // Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования.
  // Предусловие:
  // Пользователь авторизован в системе
  // Корзина пуста

  test('TK5. Go to cart with 9 the same items', async({page}) => {
    const locator = page.locator('.hasDiscount');
    const count = await locator.count();
    const randomIndex = Math.floor(Math.random() * count);                  //Выбор случайного акционного элемента
    await locator.nth(randomIndex).locator('.actionBuyProduct').click();              
    
    const productName = await locator.nth(randomIndex).locator('.product_name').textContent



    await locator.nth(randomIndex).locator('.actionBuyProduct').click(); 
     //const locator = page.locator('.product_name');
    //await locator.nth(randomIndex).locator('.actionBuyProduct').click();
    //const element = page.locator('text=/^Блокнот в точку/');
    //await page.locator('text=/^Блокнот в точку/').getByRole('button', {name: "Купить"}).click();
    //await expect(element).toBeVisible();

  })
//   test('Выбор случайного элемента', async ({ page }) => {
//     await page.goto('https://example.com');
//     const locator = page.locator('div.example-class');
//     const count = await locator.count(); // Получаем количество элементов
//     const randomIndex = Math.floor(Math.random() * count); // Выбираем случайный индекс
//     await locator.nth(randomIndex).click(); // Клик по случайному элементу
//   });

  //await page.locator('div:nth-child(2) > .note-item > .note-poster > .product_poster').click();
   /// await page.locator('div:nth-child(2) > .note-item > .card-body > .actionBuyProduct').click();
 //await page.getByRole('button', { name: 'Перейти в корзину' }).click();

    // await page.getByText('-300 р').click();
    // await page.getByText('300').click();
    // await page.locator('.actionBuyProduct').first().click();
    // await page.locator('div:nth-child(2) > .note-item > .note-poster > .product_poster').click();
    // await page.locator('div:nth-child(2) > .note-item > .card-body > .actionBuyProduct').click();
    // await page.getByText('Корзина', { exact: true }).click();

    // await page.locator('div:nth-child(2) > .note-item > .card-body > .actionBuyProduct').click();
    // await page.getByText('2', { exact: true }).first().click();
    // await page.getByText('Корзина', { exact: true }).click();
    // await page.getByRole('button', { name: 'Перейти в корзину' }).click();

//await page.goto('https://enotes.pointschool.ru/login');
 // await page.locator('div:nth-child(2) > .note-item > .card-body > .actionBuyProduct').click();
    // await page.getByText('Корзина', { exact: true }).click();
    // await page.getByLabel('Корзина').getByText('1').click();
    // await page.getByText('Корзина', { exact: true }).click();
    // await page.getByLabel('Корзина').getByText('Блокнот в точку').click();
    // await page.getByText('Корзина', { exact: true }).click();
    // await page.getByRole('button', { name: 'Перейти в корзину' }).click();
