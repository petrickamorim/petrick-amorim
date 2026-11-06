// Guards deploy files that the Angular unit-test build cannot reach:
// vercel.json must be valid JSON, and the project screenshots must stay light.
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const checks = {
  'vercel.json parses and points at the Angular browser output': () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    assert.equal(config.outputDirectory, 'dist/petrick-amorim/browser');
    const sources = config.headers.map((h) => h.source);
    assert.ok(sources.includes('/(.*)\\.(js|css)'), 'immutable cache for js/css');
  },
  'project screenshots are under 200KB each': () => {
    for (const file of ['ju-desk.jpg', 'ju-mob.jpg']) {
      const size = statSync(`public/projects/${file}`).size;
      assert.ok(size < 200 * 1024, `${file} is ${Math.round(size / 1024)}KB`);
    }
  },
  'project screenshots ship lighter AVIF and WebP versions of each JPEG': () => {
    for (const base of ['ju-desk', 'ju-mob']) {
      const jpg = statSync(`public/projects/${base}.jpg`).size;
      for (const ext of ['avif', 'webp']) {
        const size = statSync(`public/projects/${base}.${ext}`).size;
        assert.ok(size < jpg, `${base}.${ext} (${Math.round(size / 1024)}KB) is not lighter than the JPEG (${Math.round(jpg / 1024)}KB)`);
      }
    }
  },
};

let failed = 0;
for (const [name, run] of Object.entries(checks)) {
  try {
    run();
    console.log(`ok   ${name}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${name}: ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
