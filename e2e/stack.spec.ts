import { Page, expect, test } from '@playwright/test';

/** Scroll range of the pinned stack, measured from the pin spacer GSAP wraps it in. */
async function stackRange(page: Page) {
  await expect(page.locator('.pin-spacer > #stack')).toHaveCount(1, { timeout: 5000 });
  const measure = () =>
    page.evaluate(() => {
      const spacer = document.getElementById('stack')!.parentElement!;
      const start = spacer.getBoundingClientRect().top + scrollY;
      return { start, end: start + spacer.offsetHeight - innerHeight };
    });
  // Layout can still shift while fonts/pins settle: wait for two equal readings.
  let prev = await measure();
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(150);
    const cur = await measure();
    if (cur.start === prev.start && cur.end === prev.end) return cur;
    prev = cur;
  }
  return prev;
}

async function scrollToStackEnd(page: Page) {
  await page.goto('/');
  const { end } = await stackRange(page);
  await page.evaluate((y) => scrollTo(0, y), end - 5);
}

test.describe('how I build', () => {
  test('reveals the five layers with their names and lights them all at the end', async ({ page }) => {
    await scrollToStackEnd(page);
    const names = page.locator('#stack .lab h4');
    await expect(names).toHaveText(['Frontend', 'Backend', 'Banco de Dados', 'DevOps', 'Segurança & Qualidade'], {
      timeout: 4000,
    });
    await expect(page.locator('#stack .plate.hot')).toHaveCount(5);
    await expect(page.locator('#stack .lab p').first()).toHaveText('Angular · TypeScript · JavaScript');
  });

  test('translates the layer names', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang button', { hasText: 'EN' }).click();
    const { end } = await stackRange(page);
    await page.evaluate((y) => scrollTo(0, y), end - 5);
    await expect(page.locator('#stack .lab h4').nth(2)).toHaveText('Databases', { timeout: 4000 });
    await expect(page.locator('#stack .lab h4').nth(4)).toHaveText('Security & Quality');
  });

  test('pins the section while the scene plays', async ({ page }) => {
    await page.goto('/');
    const { start, end } = await stackRange(page);
    await page.evaluate((y) => scrollTo(0, y), start + (end - start) / 2);
    // The pin is applied from the scroll handler, so allow it a frame to catch up.
    await expect
      .poll(() => page.evaluate(() => Math.abs(document.getElementById('stack')!.getBoundingClientRect().top)))
      .toBeLessThanOrEqual(2);
  });
});
