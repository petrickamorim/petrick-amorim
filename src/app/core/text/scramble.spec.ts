import { decodeInto, scramble } from './scramble';

describe('scramble', () => {
  it('returns the real text at full progress', () => {
    expect(scramble('Petrick Amorim', 1)).toBe('Petrick Amorim');
  });

  it('replaces unrevealed characters but keeps spaces', () => {
    expect(scramble('ab cd', 0, () => 0)).toBe('!! !!');
  });

  it('keeps middle dots untouched', () => {
    expect(scramble('a·b', 0, () => 0)).toBe('!·!');
  });

  it('clamps progress outside 0..1', () => {
    expect(scramble('abc', -1, () => 0)).toBe('!!!');
    expect(scramble('abc', 2)).toBe('abc');
  });

  it('reveals a prefix proportional to progress', () => {
    expect(scramble('abcd', 0.5, () => 0)).toBe('ab!!');
  });
});

describe('decodeInto', () => {
  it('writes the final text immediately with reduced motion', async () => {
    const el = document.createElement('span');
    const done = decodeInto(el, 'Olá', 700, { reducedMotion: true });
    expect(el.textContent).toBe('Olá');
    await done;
  });

  it('lets the latest call win when two decodes overlap', async () => {
    const el = document.createElement('span');
    const first = decodeInto(el, 'Primeiro', 30);
    const second = decodeInto(el, 'Segundo', 30);
    await Promise.all([first, second]);
    expect(el.textContent).toBe('Segundo');
  });
});
