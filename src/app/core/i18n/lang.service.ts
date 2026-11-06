import { Injectable, signal } from '@angular/core';
import { L10n, Lang } from './i18n.types';

const KEY = 'lang';

function readStored(): Lang {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
}

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly current = signal<Lang>(readStored());
  readonly lang = this.current.asReadonly();

  constructor() {
    this.applyHtmlLang(this.current());
  }

  set(l: Lang): void {
    this.current.set(l);
    this.applyHtmlLang(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage blocked: the choice just won't persist */
    }
  }

  t(v: L10n | string): string {
    return typeof v === 'string' ? v : v[this.current()];
  }

  private applyHtmlLang(l: Lang): void {
    document.documentElement.lang = l === 'pt' ? 'pt-br' : 'en';
  }
}
