'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FolderCode, BookMarked, Wrench, Settings, Swords } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';

const tabDefs = [
  { href: '/',          labelKey: 'courses' as const,  Icon: BookOpen },
  { href: '/topics',   labelKey: 'projects' as const, Icon: FolderCode },
  { href: '/arena',    labelKey: 'arena' as const,     Icon: Swords },
  { href: '/glossary', labelKey: 'glossary' as const,  Icon: BookMarked },
  { href: '/workshop', labelKey: 'workshop' as const,  Icon: Wrench },
  { href: '/settings', labelKey: 'settings' as const, Icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="desktop-nav">
        <Link href="/" className="desktop-nav-logo" style={{ textDecoration: 'none' }}>
          <img src="/logocoduy.png" alt="Coduy" style={{ height: 24, opacity: 0.9 }} />
        </Link>
        <div className="desktop-nav-links">
          {tabDefs.map(({ href, labelKey, Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`desktop-nav-item ${active ? 'active' : ''}`}>
                <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
                <span>{s(labelKey, locale)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <div className="mobile-nav">
        {tabDefs.map(({ href, labelKey, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 4, padding: '10px 4px 12px',
                color: active ? '#fff' : '#444',
                textDecoration: 'none', transition: 'color 0.15s',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>
                {s(labelKey, locale)}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
