'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'sk';

/** Detect locale: .sk domain = Slovak, device language sk = Slovak, otherwise English */
function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  // Domain-based: coduy.sk = SK
  const host = window.location.hostname;
  if (host.endsWith('.sk')) return 'sk';
  // Device language: Slovak device = SK
  const lang = navigator.language || (navigator as any).userLanguage || '';
  if (lang.startsWith('sk')) return 'sk';
  return 'en';
}

// Detect immediately on load (before any render) so first render is correct
const domainLocale = detectLocale();

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  checkDomain: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: domainLocale,
      setLocale: (locale) => { set({ locale }); if (typeof window !== 'undefined') localStorage.setItem('coduy-locale-set', '1'); },
      toggle: () => { const next = get().locale === 'en' ? 'sk' : 'en'; set({ locale: next }); if (typeof window !== 'undefined') localStorage.setItem('coduy-locale-set', '1'); },
      checkDomain: () => {
        set({ locale: detectLocale() });
      },
    }),
    {
      name: 'coduy-locale',
      partialize: (s) => ({ locale: s.locale }),
      // On first load, detect locale. After that, respect user's choice from Settings
      onRehydrateStorage: () => (state) => {
        if (state && !localStorage.getItem('coduy-locale-set')) {
          state.locale = detectLocale();
        }
      },
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
