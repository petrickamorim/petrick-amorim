import { expect, test } from '@playwright/test';

const bottom = (page: import('@playwright/test').Page) =>
  page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

test.describe('contact', () => {
  test('shows 4 social links with correct hrefs once scrolled to the bottom', async ({ page }) => {
    await page.goto('/');
    await bottom(page);
    const links = page.locator('#contato .socials a');
    await expect(links).toHaveCount(4);
    const hrefs = [
      'https://br.linkedin.com/in/petrick-amorim-62b215302',
      'https://github.com/petrickamorim',
      'https://instagram.com/amorinx_',
      'https://wa.me/5511945248092',
    ];
    for (let i = 0; i < 4; i++) {
      await expect(links.nth(i)).toHaveAttribute('href', hrefs[i]);
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
      await expect(links.nth(i)).toHaveCSS('opacity', '1', { timeout: 4000 });
    }
  });

  test('copies the email to the clipboard and confirms', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await bottom(page);
    await page.locator('#contato .mail').click();
    await expect(page.locator('#contato .copied')).toHaveText('✓ copiado');
    await expect(page.locator('#contato .copied')).toHaveCSS('opacity', '1', { timeout: 2000 });
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('gamehunter200513@gmail.com');
  });

  test('copies the email with the Space key', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await bottom(page);
    const y0 = await page.evaluate(() => scrollY);
    await page.locator('#contato .mail').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#contato .copied')).toHaveCSS('opacity', '1', { timeout: 2000 });
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('gamehunter200513@gmail.com');
    expect(await page.evaluate(() => scrollY)).toBe(y0);
  });

  test('fills the title as the bottom is reached', async ({ page }) => {
    await page.goto('/');
    await bottom(page);
    await expect
      .poll(() => page.locator('#contato .reveal').evaluate((el) => getComputedStyle(el).backgroundPositionX), { timeout: 4000 })
      .toBe('0%');
  });

  test('switches to English', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang button').getByText('EN', { exact: true }).click();
    await bottom(page);
    await expect(page.locator('#contato .reveal')).toContainText("Let's");
    await expect(page.locator('#contato .avail')).toContainText('available for new projects');
  });

  test('has no horizontal scroll at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await bottom(page);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBe(true);
  });
});
