'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const bottomNav = [
  ['首页', '/'],
  ['图鉴', '/animals'],
  ['论坛', '/forum'],
  ['求助', '/help'],
  ['领养', '/adoption'],
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState('/');

  useEffect(() => {
    // Set initial active state
    const match = bottomNav.find(([, href]) =>
      href === '/' ? pathname === '/' : pathname.startsWith(href)
    );
    setActiveHref(match ? match[1] : '/');
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-amber-100 bg-white/95 backdrop-blur-md md:hidden safe-area-inset">
      <div className="flex items-center">
        {bottomNav.map(([label, href]) => {
          const active = activeHref === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center py-3 text-base transition-all ${
                active ? 'text-amber-600 font-bold scale-110' : 'text-slate-400 font-normal'
              }`}
            >
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
