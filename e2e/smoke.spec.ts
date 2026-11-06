import { expect, test } from '@playwright/test';

test('app boots with dark background', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(5, 5, 5)');
  expect(errors).toEqual([]);
});

test('uses the site icon instead of the framework default', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', 'favicon.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', 'apple-touch-icon.png');
  const svg = await request.get('/favicon.svg');
  expect(svg.ok()).toBe(true);
  expect(await svg.text()).toContain('#a855f7');
  const ico = await request.get('/favicon.ico');
  expect((await ico.body()).length).toBeLessThan(5000);
});
