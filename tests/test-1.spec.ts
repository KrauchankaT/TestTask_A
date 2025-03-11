import { test, expect } from '@playwright/test';

test('LogIn', async ({ page }) => {
  await page.goto('/login');
  const loginField = page.getByRole('textbox', { name: 'Логин' });
  const passwordField = page.getByRole('textbox', { name: 'Пароль' });


  await loginField.click();
  await loginField.fill('test');
  await passwordField.click();
  await passwordField.pressSequentially('test');   //уточнить про импользование pressSequentially

  await page.getByRole('button', { name: 'Вход' }).click();
});

  

//   const spanValue = await page.$eval('span.example-class', span => span.innerText)
//   if (+basketCountItems > 0) {
//     await page.getByText('Корзина', { exact: true }).click();
//     await page.getByRole('button', { name: 'Очистить корзину' }).click();
//   }
//   await expect     await page.getByText('1', { exact: true }).first().click();
//   await page.getByText('1', { exact: true }).first().click();

//   const tweetHandle = await page.$('.tweet');
// expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe('100');
// expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe('10');
// // Ожидание элемента корзины
// await page.waitForSelector('.cart');

// // Проверка, пуста ли корзина
// const cartItems = await page.$$('.cart-item');
// if (cartItems.length > 0) {
//     console.log(`Корзина содержит ${cartItems.length} товар(ов). Очистка корзины...`);

//     // Очистка корзины
//     for (const item of cartItems) {
//         // Найдите и нажмите кнопку удаления для каждого товара
//         await item.$eval('.remove-button', button => button.click());
//     }

//     // Убедитесь, что корзина пуста
//     const updatedCartItems = await page.$$('.cart-item');
//     if (updatedCartItems.length === 0) {
//         console.log('Корзина успешно очищена.');
//     } else {
//         console.log('Не удалось очистить корзину.');
//     }
// } else {
//     console.log('Корзина пуста.');
// }


 // await page.getByText('1', { exact: true }).first().click();
