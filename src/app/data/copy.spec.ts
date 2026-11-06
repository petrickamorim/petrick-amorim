import { COPY } from './copy';

describe('COPY', () => {
  it('has portuguese and english text for every entry', () => {
    for (const [key, v] of Object.entries(COPY)) {
      expect(v.pt.trim(), `${key}.pt`).not.toBe('');
      expect(v.en.trim(), `${key}.en`).not.toBe('');
    }
  });

  it('keeps the approved portuguese headlines', () => {
    expect(COPY.hello.pt).toBe('Olá! Meu nome é');
    expect(COPY.stackTitle.pt).toBe('Como eu construo.');
    expect(COPY.stackTitle.en).toBe('How I build.');
    expect(COPY.contactTitle.pt).toBe('Vamos<br>conversar?');
  });
});
