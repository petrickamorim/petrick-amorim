import { Page, expect, test } from '@playwright/test';
import { STACK_LAYERS } from '../src/app/data/stack-layers';

const TITLES = ['Ju Duarte', 'SecureAuth', 'Delivery', 'TaskFlow'];
const GARBAGE = /[!<>\-_\\/\[\]{}=+*^?#]{3,}/;

/** Text nodes anywhere in the page that still hold decode noise. */
function garbage(page: Page): Promise<string[]> {
  return page.evaluate((src) => {
    const re = new RegExp(src);
    const out: string[] = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const tag = n.parentElement?.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') continue;
      if (re.test(n.textContent ?? '')) out.push(`${n.parentElement?.className}: ${n.textContent}`);
    }
    return out;
  }, GARBAGE.source);
}

/** Opacity as painted: the element's own times every ancestor's. */
function paintedOpacity(page: Page, selector: string): Promise<number[]> {
  return page.evaluate((sel) => {
    return Array.from(document.querySelectorAll(sel)).map((el) => {
      let o = 1;
      for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
      return Math.round(o * 100) / 100;
    });
  }, selector);
}

/** Walks the page top to bottom like a reader, half a viewport at a time. */
async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = innerHeight / 2;
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(800);
}

async function scrollToSection(page: Page, id: string): Promise<void> {
  await page.evaluate((sid) => {
    const el = document.getElementById(sid)!;
    const anchor = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
    scrollTo(0, anchor.getBoundingClientRect().top + scrollY);
  }, id);
}

const enButton = (page: Page) => page.locator('.lang button').getByText('EN', { exact: true });

test.describe('reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('shows every final state without pins or scrambles', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home .name')).toHaveText('Petrick Amorim', { timeout: 1500 });
    await expect(page.locator('#home .hello')).toHaveText('Olá! Meu nome é');
    expect(await page.locator('.pin-spacer').count()).toBe(0);

    // the stack scene is rendered in its final state, statically
    await expect(page.locator('#stack .lab h4')).toHaveText(STACK_LAYERS.map((l) => l.name.pt));
    await expect(page.locator('#stack .lab p')).toHaveText(STACK_LAYERS.map((l) => l.techs.join(' · ')));
    await expect(page.locator('#stack .plate.hot')).toHaveCount(STACK_LAYERS.length);

    await scrollThrough(page);
    await expect(page.locator('#projetos .row .t')).toHaveText(TITLES);
    for (const sel of [
      '#stack .lab',
      '.sh',
      '.shs',
      '#projetos .row .rh',
      '#exp .item',
      '#exp .hl li',
      '#contato .reveal',
      '#contato .csub',
      '#contato .mail',
      '#contato .socials a',
      '#contato .avail',
    ]) {
      const ops = await paintedOpacity(page, sel);
      expect(ops.length, sel).toBeGreaterThan(0);
      expect(ops.every((o) => o === 1), `${sel} ${ops}`).toBe(true);
    }
    expect(await garbage(page)).toEqual([]);
  });

  test('an opened panel shows its final texts at once', async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'projetos');
    const row = page.locator('#projetos .row').nth(1);
    await row.locator('.rh').click();
    await expect(row.locator('.bootl')).toHaveText('> pronto · POST /api/auth/login', { timeout: 1500 });
    await expect(row.locator('.big')).toHaveText('SecureUserAuthAPI');
    await expect(row.locator('.num b')).toHaveText(['15min', '512', 'OWASP'], { timeout: 1500 });
  });
});

test.describe('language switch mid-animation', () => {
  test('300ms after load the intro ends in English', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    await enButton(page).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('#home .hello')).toHaveText('Hi! My name is');
    await expect(page.locator('#home .name')).toHaveText('Petrick Amorim');
    await expect.poll(() => garbage(page), { timeout: 3000 }).toEqual([]);
  });

  test('the hello is never left in the old language once switched', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home .hello')).not.toBeEmpty();
    await enButton(page).click();
    await expect(page.locator('#home .hello')).toHaveText('Hi! My name is', { timeout: 300 });
  });

  test('while a row is opening the panel ends in English', async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'projetos');
    const row = page.locator('#projetos .row').nth(1);
    await row.locator('.rh').click();
    await page.waitForTimeout(300);
    await enButton(page).click();
    await page.waitForTimeout(3000);
    await expect(row.locator('.bootl')).toHaveText('> ready · POST /api/auth/login');
    await expect(row.locator('.node').first()).toContainText('Client');
    await expect(row.locator('.send')).toHaveText(/Send/);
    await expect(row.locator('.kick')).toHaveText('backend · security');
    await expect(row.locator('.beat .k')).toHaveText(['CHALLENGE', 'WHAT I DID', 'RESULT']);
    await expect(row.locator('.num span')).toHaveText(['token lifetime', 'hash bits', 'aligned']);
    await expect(row.locator('.num b')).toHaveText(['15min', '512', 'OWASP']);
    await expect(row.locator('.res .head')).toHaveText(/^● 200 OK · \d+ms$/);
    await expect.poll(() => garbage(page), { timeout: 3000 }).toEqual([]);
  });

  test('a panel opened after the switch boots in English', async ({ page }) => {
    await page.goto('/');
    await enButton(page).click();
    await scrollToSection(page, 'projetos');
    const row = page.locator('#projetos .row').nth(0);
    await row.locator('.rh').click();
    await expect(row.locator('.bootl')).toHaveText(/^> connected · /, { timeout: 3000 });
    await expect(row.locator('.send')).toHaveText(/Visit site/);
  });

  test('while stack labels are half-decoded they end in English', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'same code path; the scrubbed pin is measured on desktop');
    await page.goto('/');
    await page.waitForTimeout(500);
    // progress 0.65: layer 3 fully decoded, layer 4 half-way
    await page.evaluate(() => {
      const spacer = document.getElementById('stack')!.parentElement!;
      scrollTo(0, spacer.offsetTop + 0.65 * 2.2 * innerHeight);
    });
    const labs = page.locator('#stack .lab');
    await expect(labs.nth(2).locator('h4')).toHaveText('Banco de Dados');
    expect(await labs.nth(3).locator('p').textContent()).not.toBe(STACK_LAYERS[3].techs.join(' · '));

    await enButton(page).click();
    await expect(labs.nth(2).locator('h4')).toHaveText('Databases', { timeout: 500 });
    expect(await labs.nth(3).locator('p').textContent()).not.toBe(STACK_LAYERS[3].techs.join(' · '));

    await scrollToSection(page, 'projetos');
    await page.waitForTimeout(3000);
    await expect(labs.locator('h4')).toHaveText(STACK_LAYERS.map((l) => l.name.en));
    await expect(page.locator('#home .hello')).toHaveText('Hi! My name is');
    await expect.poll(() => garbage(page), { timeout: 3000 }).toEqual([]);
  });
});

test('projects and experience headers look the same', async ({ page }) => {
  await page.goto('/');
  for (const id of ['#projetos', '#exp']) {
    await expect(page.locator(`${id} .sh`)).toHaveCSS('font-weight', '800');
    await expect(page.locator(`${id} .sh`)).toHaveCSS('letter-spacing', /^-/);
    await expect(page.locator(`${id} .sh .dot`)).toHaveCSS('color', 'rgb(168, 85, 247)');
    await expect(page.locator(`${id} .shs`)).toHaveCSS('color', 'rgb(138, 138, 138)');
    await expect(page.locator(`${id} .shs`)).toHaveCSS('font-size', '13px');
    await expect(page.locator(`${id} .shs`)).toHaveCSS('margin-bottom', '48px');
  }
  const sizes = await page.locator('.sh').evaluateAll((els) => els.map((e) => getComputedStyle(e).fontSize));
  expect(new Set(sizes).size).toBe(1);
});

test.describe('mobile 390', () => {
  test('no section scrolls sideways', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile only');
    await page.goto('/');
    const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= 390 && document.body.scrollWidth <= 390);
    expect(await fits()).toBe(true);
    for (const id of ['stack', 'projetos', 'exp', 'contato']) {
      await scrollToSection(page, id);
      await page.waitForTimeout(400);
      expect(await fits(), id).toBe(true);
    }
    // mid-stack scene, with the plates spread out
    await page.evaluate(() => {
      const spacer = document.getElementById('stack')!.parentElement!;
      scrollTo(0, spacer.offsetTop + 0.7 * 2.2 * innerHeight);
    });
    await page.waitForTimeout(300);
    expect(await fits(), 'stack mid-scene').toBe(true);
    // every panel open
    await scrollToSection(page, 'projetos');
    const rows = page.locator('#projetos .row');
    for (let i = 0; i < TITLES.length; i++) {
      await rows.nth(i).locator('.rh').click();
      await page.waitForTimeout(2200);
      expect(await fits(), `panel ${TITLES[i]}`).toBe(true);
    }
    await enButton(page).click();
    await page.waitForTimeout(300);
    expect(await fits(), 'English').toBe(true);
  });
});
