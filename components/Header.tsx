'use client';

import Link from 'next/link';
import { useState } from 'react';
import AuthActions from '@/components/AuthActions';

const nav = [
  ['首页', '/'],
  ['猫狗图鉴', '/animals'],
  ['论坛', '/forum'],
  ['求助', '/help'],
  ['领养', '/adoption'],
  ['科普知识', '/knowledge'],
  ['关于我们', '/about']
] as const;

const adminNav = [['管理后台', '/admin'] as const];

type HeaderProps = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  nickname?: string;
  extraNav?: ([string, string] | readonly [string, string])[];
};

export default function Header({ isLoggedIn, isAdmin, nickname, extraNav = [] }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const allNav = [...nav, ...extraNav];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/85 backdrop-blur-md hidden md:block">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <h1 className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">🐾 西财猫猫狗狗</h1>
          <nav className="flex flex-wrap gap-2 text-sm">
            {allNav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-1 text-slate-700 transition hover:bg-amber-100 hover:text-amber-900"
              >
                {label}
              </Link>
            ))}
          </nav>
          <AuthActions isLoggedIn={isLoggedIn} isAdmin={isAdmin} nickname={nickname} />
        </div>
      </header>

      {/* Mobile Header - minimal, just logo */}
      <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center px-4 py-3">
          <h1 className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">🐾 西财猫猫狗狗</h1>
          <div className="ml-auto">
            <AuthActions isLoggedIn={isLoggedIn} isAdmin={isAdmin} nickname={nickname} />
          </div>
        </div>
      </header>
    </>
  );
}
