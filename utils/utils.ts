import { Page, expect,request } from '@playwright/test';


export async function clearBasket(page: Page) {
    
    // Receive CSRF-token
    const csrfToken = await page.evaluate(() => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    });

    if (!csrfToken) {
        throw new Error("❌ CSRF Token not found! Aborting request.");
    }

    // Receive cookies
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const response = await page.request.post('/basket/clear', {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken, 
            'Cookie': cookieHeader 
        }
    });

    expect(response.status()).toBe(200);
    await page.reload({ waitUntil: 'load' });

    expect(page.locator('.basket-count-items')).toHaveText('0');
}