'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/store/localeStore';

export default function LocaleInit() {
  const { checkDomain } = useLocaleStore();
  useEffect(() => { checkDomain(); }, []);
  return null;
}
