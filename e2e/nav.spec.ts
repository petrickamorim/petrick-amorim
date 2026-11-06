import { expect, test } from '@playwright/test';

const PURPLE = 'rgb(168, 85, 247)';

test.describe('nav', () => {
  test('shows only the language toggle on the home', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.lang')).toBeVisible();
    await expect(page.locator('.idx')).toHaveCSS('opacity', '0');
  });

  test('reveals the section index after the stack and highlights the current one', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projetos').scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const el = document.getElementById('projetos')!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 10);
    });
    await expect(page.locator('.idx')).toHaveCSS('opacity', '1');
    await expect(page.locator('.idx a', { hasText: '02' })).toHaveCSS('color', PURPLE);
  });

  test('switches to english and remembers it', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang button', { hasText: 'EN' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#stack .bigt')).toHaveText('How I build.');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('jumps to contact and to the start of the stack', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.getElementById('projetos')!.offsetTop));
    await expect(page.locator('.idx')).toHaveCSS('opacity', '1');

    await page.locator('.idx a', { hasText: '04' }).click();
    await expect(page.locator('#contato')).toBeInViewport();

    await page.locator('.idx a', { hasText: '01' }).click();
    await expect
      .poll(async () => page.evaluate(() => Math.abs(document.getElementById('stack')!.getBoundingClientRect().top)))
      .toBeLessThanOrEqual(2);
  });

  test('index entries jump with the Space key', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.getElementById('projetos')!.offsetTop));
    await expect(page.locator('.idx')).toHaveCSS('opacity', '1');
    await page.locator('.idx', { hasText: '04' }).getByText('04').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#contato')).toBeInViewport({ timeout: 6000 });
  });
});
