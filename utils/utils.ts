import { Page, expect,request } from '@playwright/test';


export async function clearBasket(page: Page) {
    
    // Извлекаем CSRF-токен
    const csrfToken = await page.evaluate(() => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    });

    if (!csrfToken) {
        throw new Error("❌ CSRF Token not found! Aborting request.");
    }

    // Извлекаем cookies
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // Отправляем POST-запрос на очистку корзины
    const response = await page.request.post('/basket/clear', {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken, // Передаем CSRF-токен
            'Cookie': cookieHeader // Передаем куки авторизации
        }
    });

    await expect(response.status()).toBe(200);
 //   await page.reload({ waitUntil: 'load' });
}