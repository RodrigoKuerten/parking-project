import { signal } from '@angular/core';
import { en, type Dictionary } from './locales/en';
import { pt } from './locales/pt';
import { es } from './locales/es';

export type Locale = 'pt' | 'en' | 'es';
export type TranslationKey = keyof Dictionary;

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
];

const DICTIONARIES: Record<Locale, Dictionary> = { pt, en, es };
/** BCP 47 tags for Intl formatters and <html lang>. */
const INTL_TAGS: Record<Locale, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-419' };
const STORAGE_KEY = 'patio.locale';
const DEFAULT_LOCALE: Locale = 'pt';

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt' || stored === 'en' || stored === 'es') {
      return stored;
    }
  } catch {
    // Storage blocked (private mode, disabled site data): fall back to default.
  }
  return DEFAULT_LOCALE;
}

export const locale = signal<Locale>(readStoredLocale());

/** Intl locale tag for the active language; reading it in a template tracks the language. */
export function intlLocale(): string {
  return INTL_TAGS[locale()];
}

export function setLocale(next: Locale): void {
  locale.set(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisted; the choice still applies for this page session.
  }
  document.documentElement.lang = INTL_TAGS[next];
}

/** Translate a key in the active language. `{name}` placeholders are replaced from params. */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let text = DICTIONARIES[locale()][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = INTL_TAGS[locale()];
}
