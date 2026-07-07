'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FolderCode, BookMarked, Wrench, Play } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';

const tabDefs = [
  { href: '/',          labelKey: 'courses' as const,  Icon: BookOpen },
  { href: '/reels',    labelKey: 'reels' as const,    Icon: Play },
  { href: '/topics',   labelKey: 'projects' as const, Icon: FolderCode },
  { href: '/glossary', labelKey: 'glossary' as const,  Icon: BookMarked },
  { href: '/workshop', labelKey: 'workshop' as const,  Icon: Wrench },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="desktop-nav">
        <div className="desktop-nav-logo">
          <img src="/logocoduy.png" alt="Coduy" style={{ height: 24, opacity: 0.9 }} />
        </div>
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
