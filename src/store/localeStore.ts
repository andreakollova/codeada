'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'sk';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      toggle: () => set({ locale: get().locale === 'en' ? 'sk' : 'en' }),
    }),
    { name: 'coduy-locale' }
  )
);

/** Helper to pick EN or SK field from a DB row */
export function t(row: any, field: string, locale: Locale): string {
  if (locale === 'sk') {
    const skVal = row[`${field}_sk`];
    if (skVal) return skVal;
  }
  return row[field] ?? '';
}

/** Helper for arrays (key_takeaways) */
export function tArray(row: any, field: string, locale: Locale): string[] {
  if (locale === 'sk') {
    const skVal = row[`${field}_sk`];
    if (skVal && Array.isArray(skVal) && skVal.length > 0) return skVal;
  }
  return row[field] ?? [];
}
