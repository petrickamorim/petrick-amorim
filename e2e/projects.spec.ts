import { expect, test } from '@playwright/test';

const TITLES = ['Ju Duarte', 'SecureAuth', 'Delivery', 'TaskFlow'];

async function gotoList(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => {
    const el = document.getElementById('projetos')!;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  });
  await expect(page.locator('#projetos .row')).toHaveCount(4);
}

test.describe('projects index', () => {
  test('lists the four projects in data order', async ({ page }) => {
    await gotoList(page);
    await expect(page.locator('#projetos .row .t')).toHaveText(TITLES, { timeout: 3000 });
  });

  test('decodes the titles when the list enters the viewport', async ({ page }) => {
    await gotoList(page);
    await page.waitForTimeout(1500);
    await expect(page.locator('#projetos .row .t')).toHaveText(TITLES);
  });

  test('hover paints the purple wipe and fills the title', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'hover is a desktop interaction');
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(0);
    await row.scrollIntoViewIfNeeded();
    await row.locator('.rh').hover();
    await expect
      .poll(() => row.locator('.rh').evaluate((el) => getComputedStyle(el, '::before').transform))
      .toBe('matrix(1, 0, 0, 1, 0, 0)');
    await expect(row.locator('.t')).toHaveCSS('color', 'rgb(242, 242, 242)');
  });

  test('a scan line sweeps the list', async ({ page }) => {
    await gotoList(page);
    await expect
      .poll(() => page.evaluate(() => document.querySelector('#projetos .scan')?.getAnimations().length ?? 0), {
        timeout: 8000,
        intervals: [100],
      })
      .toBeGreaterThan(0);
  });

  test('opens one row at a time', async ({ page }) => {
    await gotoList(page);
    const rows = page.locator('#projetos .row');
    await rows.nth(1).locator('.rh').click();
    await expect(rows.nth(1)).toHaveClass(/open/);
    await rows.nth(2).locator('.rh').click();
    await expect(rows.nth(2)).toHaveClass(/open/);
    await expect(page.locator('#projetos .row.open')).toHaveCount(1);
    await rows.nth(2).locator('.rh').click();
    await expect(page.locator('#projetos .row.open')).toHaveCount(0);
  });

  test('scroll triggers stay correct after opening and closing a row', async ({ page }) => {
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(1);
    await row.locator('.rh').click();
    await expect(row).toHaveClass(/open/);
    await page.waitForTimeout(1500);
    await row.locator('.rh').click();
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, document.getElementById('projetos')!.offsetTop));
    await expect(page.locator('.idx')).toHaveCSS('opacity', '1');
    await page.locator('.idx a', { hasText: '03' }).click();
    await expect
      .poll(async () => page.evaluate(() => Math.abs(document.getElementById('exp')!.getBoundingClientRect().top)), {
        timeout: 6000,
      })
      .toBeLessThanOrEqual(2);
  });

  test('mobile hides the stack and sparkline and shows status under the title', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile only');
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(0);
    await expect(row.locator('.g')).toBeHidden();
    await expect(row.locator('.spark')).toBeHidden();
    const t = await row.locator('.t').boundingBox();
    const s = await row.locator('.rh .stt').boundingBox();
    expect(s!.y).toBeGreaterThan(t!.y + t!.height - 8);
  });
});

test.describe('project panel', () => {
  test('secure auth runs its request and shows the story', async ({ page }) => {
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(1);
    await row.locator('.rh').click();
    await expect(row.locator('.res')).toContainText('"accessToken"', { timeout: 4000 });
    await expect(row.locator('.res')).toContainText('200 OK');
    await expect(row.locator('.beat .k')).toHaveText(['DESAFIO', 'O QUE FIZ', 'RESULTADO']);
    await expect(row.locator('.num b')).toHaveText(['15min', '512', 'OWASP'], { timeout: 3000 });
    const chips = row.locator('.chip');
    await expect(chips.nth(0)).toHaveText('.NET 8');
    expect(await chips.nth(0).evaluate((el) => getComputedStyle(el, '::before').content)).toBe('"02"');
  });

  test('ju duarte previews the site without iframes', async ({ page }) => {
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(0);
    await row.locator('.rh').click();
    await expect(row).toHaveClass(/open/);
    await expect(row.locator('a[href="https://site-julia-opal.vercel.app"]')).toHaveCount(1);
    await expect(page.locator('iframe')).toHaveCount(0);
    const imgs = row.locator('.devices img');
    expect(await imgs.count()).toBeGreaterThan(0);
    for (const img of await imgs.all()) {
      await expect(img).toHaveCSS('filter', /grayscale\(1\)/);
    }
    await expect(row.locator('.node')).toHaveText([/Visitante/, /Angular/, /Vercel/, /WhatsApp/], { timeout: 3000 });
  });

  test('mobile panel is one column with the phone but no notebook', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile only');
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(0);
    await row.locator('.rh').click();
    await expect(row).toHaveClass(/open/);
    await expect(row.locator('.desk')).toBeHidden();
    await expect(row.locator('.phone')).toBeVisible({ timeout: 3000 });
    const cols = await row.locator('.open-in').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(cols).toBe(1);
  });
});

test.describe('project panel regressions', () => {
  test('opening a row while another is open lands its header near the nav', async ({ page }) => {
    await gotoList(page);
    const rows = page.locator('#projetos .row');
    await rows.nth(1).locator('.rh').click();
    await page.waitForTimeout(1800);
    await rows.nth(2).locator('.rh').click();
    await page.waitForTimeout(2500);
    const top = await rows.nth(2).locator('.rh').evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.abs(top - 64)).toBeLessThanOrEqual(4);
  });

  test('a closed row keeps nothing focusable inside its panel', async ({ page }) => {
    await gotoList(page);
    const rows = page.locator('#projetos .row');
    const focusable = await rows
      .nth(0)
      .locator('.rb')
      .evaluate((rb) => rb.hasAttribute('inert') && rb.querySelectorAll('a, button').length > 0);
    expect(focusable).toBe(true);
    await rows.nth(0).locator('.rh').focus();
    await page.keyboard.press('Tab');
    await expect(rows.nth(1).locator('.rh')).toBeFocused();
    await expect(rows.nth(0).locator('.rh')).toHaveAttribute('aria-expanded', 'false');
  });

  test('metrics never flash their final value before counting up', async ({ page }) => {
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(1);
    const samples = await row.evaluate(async (el) => {
      const b = el.querySelector('.num b')!;
      (el.querySelector('.rh') as HTMLElement).click();
      const out: string[] = [];
      const t0 = performance.now();
      while (performance.now() - t0 < 2200) {
        if (el.querySelector('app-project-panel.ready')) out.push(b.textContent ?? '');
        await new Promise((r) => requestAnimationFrame(r));
      }
      return out;
    });
    expect(samples.length).toBeGreaterThan(5);
    expect(samples[0]).not.toBe('15min');
    const firstFinal = samples.indexOf('15min');
    expect(firstFinal).toBeGreaterThan(0);
    expect(samples.slice(firstFinal).every((s) => s === '15min')).toBe(true);
  });
});

test.describe('project panel at tablet widths', () => {
  for (const width of [820, 1024]) {
    test(`the api response stays readable at ${width}px`, async ({ page }, info) => {
      test.skip(info.project.name === 'mobile', 'viewport is set explicitly');
      await page.setViewportSize({ width, height: 1180 });
      await gotoList(page);
      const row = page.locator('#projetos .row').nth(1);
      await row.locator('.rh').click();
      const res = row.locator('.res');
      await expect(res).toContainText('"accessToken"', { timeout: 4000 });
      await expect(res).toContainText('"expiresIn"', { timeout: 4000 });
      const m = await res.evaluate((el) => ({
        sw: el.scrollWidth,
        cw: el.clientWidth,
        ox: getComputedStyle(el).overflowX,
      }));
      expect(m.cw).toBeGreaterThanOrEqual(240);
      const fits = m.sw <= m.cw + 1;
      const scrolls = m.ox === 'auto' || m.ox === 'scroll';
      expect(fits || scrolls, JSON.stringify(m)).toBe(true);
    });
  }
});

test.describe('project screenshots', () => {
  test('load lazily and decode off the main thread', async ({ page }) => {
    await gotoList(page);
    const imgs = page.locator('#projetos .devices img');
    expect(await imgs.count()).toBe(2);
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('loading', 'lazy');
      await expect(img).toHaveAttribute('decoding', 'async');
    }
  });
});

test.describe('scroll triggers after a panel grows', () => {
  async function scrollItemTo(page: import('@playwright/test').Page, ratio: number) {
    await page.evaluate((r) => {
      const el = document.querySelector('#exp .item') as HTMLElement;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * r);
    }, ratio);
  }

  test('experience still turns on at ~78% with secure auth open and its response typed', async ({ page }) => {
    await gotoList(page);
    const row = page.locator('#projetos .row').nth(1);
    await row.locator('.rh').click();
    await expect(row).toHaveClass(/open/);
    await expect(row.locator('.res .body')).toContainText('"expiresIn": 900', { timeout: 6000 });
    await expect(row.locator('.res .body')).toContainText('}', { timeout: 6000 });
    // Let the typing settle and any pending refresh run.
    await page.waitForTimeout(600);
    const item = page.locator('#exp .item').first();
    await scrollItemTo(page, 0.9);
    await page.waitForTimeout(400);
    await expect(item).not.toHaveClass(/\bon\b/);
    await scrollItemTo(page, 0.78);
    await expect(item).toHaveClass(/\bon\b/, { timeout: 3000 });
  });
});
