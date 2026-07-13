'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'sk';

/** Detect locale from domain: .sk = Slovak, everything else = English */
function detectLocaleFromDomain(): Locale {
  if (typeof window === 'undefined') return 'en';
  const host = window.location.hostname;
  if (host.endsWith('.sk')) return 'sk';
  return 'en';
}

interface LocaleState {
  locale: Locale;
  _domainChecked: boolean;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  checkDomain: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      _domainChecked: false,
      setLocale: (locale) => set({ locale }),
      toggle: () => set({ locale: get().locale === 'en' ? 'sk' : 'en' }),
      checkDomain: () => {
        const domainLocale = detectLocaleFromDomain();
        set({ locale: domainLocale, _domainChecked: true });
      },
    }),
    {
      name: 'coduy-locale',
      partialize: (s) => ({ locale: s.locale, _domainChecked: s._domainChecked }),
    }
  )
);

/** Helper to pick EN or SK field from a DB row - always returns string */
export function t(row: any, field: string, locale: Locale): string {
  if (locale === 'sk') {
    const skVal = row[`${field}_sk`];
    if (skVal != null) {
      return typeof skVal === 'string' ? skVal : JSON.stringify(skVal);
    }
  }
  const val = row[field];
  if (val == null) return '';
  return typeof val === 'string' ? val : JSON.stringify(val);
}

/** Helper for arrays (key_takeaways) - always returns string[] */
export function tArray(row: any, field: string, locale: Locale): string[] {
  if (locale === 'sk') {
    const skVal = row[`${field}_sk`];
    if (Array.isArray(skVal) && skVal.length > 0) return skVal.map(String);
  }
  const val = row[field];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') return [val];
  return [];
}
