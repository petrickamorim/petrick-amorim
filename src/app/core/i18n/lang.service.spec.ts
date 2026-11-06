import { TestBed } from '@angular/core/testing';
import { LangService } from './lang.service';

describe('LangService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('starts in portuguese', () => {
    expect(TestBed.inject(LangService).lang()).toBe('pt');
  });

  it('switches to english and updates the html lang', () => {
    const lang = TestBed.inject(LangService);
    lang.set('en');
    expect(lang.lang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(lang.t({ pt: 'a', en: 'b' })).toBe('b');
  });

  it('passes plain strings through', () => {
    expect(TestBed.inject(LangService).t('x')).toBe('x');
  });

  it('remembers the chosen language', () => {
    TestBed.inject(LangService).set('en');
    TestBed.resetTestingModule();
    expect(TestBed.inject(LangService).lang()).toBe('en');
  });

  it('does not throw when storage is unavailable', () => {
    const lang = TestBed.inject(LangService);
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => lang.set('en')).not.toThrow();
    spy.mockRestore();
  });
});
