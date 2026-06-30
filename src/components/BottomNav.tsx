'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FolderCode, BookMarked, Wrench } from 'lucide-react';

const tabs = [
  { href: '/',          label: 'Courses',   Icon: BookOpen },
  { href: '/topics',   label: 'Projects',  Icon: FolderCode },
  { href: '/glossary', label: 'Glossary',  Icon: BookMarked },
  { href: '/workshop', label: 'Workshop',  Icon: Wrench },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="desktop-nav">
        <div className="desktop-nav-logo">
          <span className="desktop-nav-logo-text">Coduy</span>
        </div>
        <div className="desktop-nav-links">
          {tabs.map(({ href, label, Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`desktop-nav-item ${active ? 'active' : ''}`}>
                <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <div className="mobile-nav">
        {tabs.map(({ href, label, Icon }) => {
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
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
