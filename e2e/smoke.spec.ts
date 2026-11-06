import { expect, test } from '@playwright/test';

test('app boots with dark background', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(5, 5, 5)');
  expect(errors).toEqual([]);
});
