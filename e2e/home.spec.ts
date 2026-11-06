import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('decodes the greeting and the name without a blinking cursor', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home .hello')).toHaveText('Olá! Meu nome é', { timeout: 4000 });
    await expect(page.locator('#home .name')).toHaveText('Petrick Amorim', { timeout: 4000 });
    await expect(page.locator('#home .caret')).toHaveCount(0);
  });

  test('shows the social icons in order after the name', async ({ page }) => {
    await page.goto('/');
    const icons = page.locator('#home .icons a');
    await expect(icons).toHaveCount(3);
    await expect(page.locator('#home .icons')).toHaveCSS('opacity', '1', { timeout: 5000 });
    await expect(icons.nth(0)).toHaveAttribute('href', 'https://br.linkedin.com/in/petrick-amorim-62b215302');
    await expect(icons.nth(1)).toHaveAttribute('href', 'https://instagram.com/amorinx_');
    await expect(icons.nth(2)).toHaveAttribute('href', 'https://github.com/petrickamorim');
  });

  test('has the discreet footer and a running warp canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home .hfoot')).toContainText('© 2026 Petrick Amorim');
    await expect(page.locator('#home canvas.warp')).toBeVisible();
  });

  test('dissolves the name when scrolling one viewport', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home .name')).toHaveText('Petrick Amorim', { timeout: 4000 });
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await expect
      .poll(async () => Number(await page.locator('#home .hero').evaluate((e) => getComputedStyle(e).opacity)))
      .toBeLessThan(0.1);
  });

  test('keeps the name inside narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('#home .name')).toHaveText('Petrick Amorim', { timeout: 4000 });
    const box = await page.locator('#home .name').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });

  test('translates the greeting', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang button', { hasText: 'EN' }).click();
    await expect(page.locator('#home .hello')).toHaveText('Hi! My name is', { timeout: 4000 });
  });
});
