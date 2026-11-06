import { expect, test } from '@playwright/test';

test.describe('experience', () => {
  test('each item turns on when its top reaches ~78% of the viewport', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('#exp .item');
    await expect(items).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await page.evaluate((idx) => {
        const el = document.querySelectorAll('#exp .item')[idx] as HTMLElement;
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.78);
      }, i);
      await expect(items.nth(i)).toHaveClass(/\bon\b/, { timeout: 3000 });
    }
  });

  test('marks the first item as current with a badge', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#exp .item').first()).toHaveClass(/\bnow\b/);
    await expect(page.locator('#exp .item').first().locator('.badge')).toHaveText('ATUAL');
    await expect(page.locator('#exp .item').nth(1).locator('.badge')).toHaveCount(0);
  });

  test('shows BNP Paribas inline on the Antlia role line without a badge', async ({ page }) => {
    await page.goto('/');
    const role = page.locator('#exp .item').nth(1).locator('.role');
    await expect(role).toHaveText('Desenvolvedor full stack · BNP Paribas');
    const bnp = role.locator('.bnp');
    await expect(bnp).toHaveText('BNP Paribas');
    await expect(bnp).toHaveCSS('font-weight', '700');
    await expect(bnp).toHaveCSS('border-top-width', '0px');
  });

  test('shows the education period and avoids forbidden wording', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#exp .item').nth(2).locator('.when')).toContainText('jul 2024 — dez 2026');
    const text = (await page.locator('#exp').textContent()) ?? '';
    expect(text.toLowerCase()).not.toContain('previsão');
    expect(text.toLowerCase()).not.toContain('cliente bnp');
  });

  test('switches to english', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang button', { hasText: 'EN' }).click();
    await expect(page.locator('#exp .item').nth(1).locator('.role')).toContainText('Full stack developer');
    await expect(page.locator('#exp .sh')).toContainText('Experience');
  });

  test('renders bullet keywords white and semi-bold', async ({ page }) => {
    await page.goto('/');
    const b = page.locator('#exp .item').first().locator('.hl li b').first();
    await expect(b).toHaveCSS('color', 'rgb(242, 242, 242)');
    await expect(b).toHaveCSS('font-weight', '600');
  });

  test('does not scroll horizontally at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('#exp').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
