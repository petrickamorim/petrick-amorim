import { L10n } from '../core/i18n/i18n.types';
import { CONTACT } from './contact';
import { EXPERIENCE } from './experience';
import { PROJECTS } from './projects';
import { STACK_LAYERS } from './stack-layers';

function collectL10n(value: unknown, path: string, out: [string, L10n][]): void {
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if (typeof o['pt'] === 'string' && typeof o['en'] === 'string' && Object.keys(o).length === 2) {
      out.push([path, o as unknown as L10n]);
      return;
    }
    for (const [k, v] of Object.entries(o)) collectL10n(v, `${path}.${k}`, out);
  }
}

describe('PROJECTS', () => {
  it('has unique slugs and orders, sorted by order', () => {
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
    const orders = PROJECTS.map((p) => p.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it('has portuguese and english for every translatable field', () => {
    const all: [string, L10n][] = [];
    collectL10n(PROJECTS, 'projects', all);
    expect(all.length).toBeGreaterThan(0);
    for (const [path, v] of all) {
      expect(v.pt.trim(), `${path}.pt`).not.toBe('');
      expect(v.en.trim(), `${path}.en`).not.toBe('');
    }
  });

  it('has exactly three metrics and a 3 to 5 node flow', () => {
    for (const p of PROJECTS) {
      expect(p.metrics.length, p.slug).toBe(3);
      expect(p.flow.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.flow.length, p.slug).toBeLessThanOrEqual(5);
    }
  });

  it('only tags layers that exist in the stack', () => {
    const layers = STACK_LAYERS.map((l) => l.no);
    for (const p of PROJECTS) for (const t of p.tags) expect(layers, `${p.slug} ${t.name}`).toContain(t.layer);
  });

  it('describes sites with a bare url and local screenshots', () => {
    for (const p of PROJECTS) {
      if (p.kind !== 'site') continue;
      expect(p.url).not.toMatch(/^https?:/);
      expect(p.desktopImage).toMatch(/^\/projects\//);
      expect(p.mobileImage).toMatch(/^\/projects\//);
    }
  });

  it('never repeats the visit site action as a link', () => {
    for (const p of PROJECTS) for (const l of p.links) expect(l.label).not.toMatch(/visit|visitar/i);
  });

  it('starts with the four approved projects', () => {
    expect(PROJECTS.map((p) => p.title)).toEqual(['Ju Duarte', 'SecureAuth', 'Delivery', 'TaskFlow']);
  });
});

describe('STACK_LAYERS', () => {
  it('uses the approved layer names', () => {
    expect(STACK_LAYERS.map((l) => l.name.pt)).toEqual([
      'Frontend',
      'Backend',
      'Banco de Dados',
      'DevOps',
      'Segurança & Qualidade',
    ]);
  });
});

describe('EXPERIENCE', () => {
  it('keeps the job titles exactly as on LinkedIn', () => {
    expect(EXPERIENCE[0].role.pt).toBe('Software Developer');
    expect(EXPERIENCE[1].role.pt).toBe('Desenvolvedor full stack');
    expect(EXPERIENCE[1].highlight).toBe('BNP Paribas');
  });

  it('shows the degree without a forecast label', () => {
    const edu = EXPERIENCE[2];
    expect(edu.org).toBe('Anhanguera');
    expect(edu.role.pt).toBe('Análise e Desenvolvimento de Sistemas');
    expect(edu.period.pt).toContain('jul 2024 — dez 2026');
  });

  it('never says previsão or cliente BNP', () => {
    const text = JSON.stringify(EXPERIENCE);
    expect(text).not.toMatch(/previs/i);
    expect(text).not.toMatch(/cliente BNP/i);
  });
});

describe('CONTACT', () => {
  it('has the approved channels', () => {
    expect(CONTACT).toEqual({
      email: 'gamehunter200513@gmail.com',
      linkedin: 'https://br.linkedin.com/in/petrick-amorim-62b215302',
      github: 'https://github.com/petrickamorim',
      instagram: 'https://instagram.com/amorinx_',
      whatsapp: 'https://wa.me/5511945248092',
    });
  });
});
