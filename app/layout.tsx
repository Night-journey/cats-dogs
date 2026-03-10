import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAuthFromCookies } from '@/lib/auth';
import AuthActions from '@/components/AuthActions';
import { query } from '@/lib/db';

export const metadata: Metadata = {
  title: '西财猫猫狗狗',
  description: '一起帮助西财猫猫狗狗'
};

const baseNav = [
  ['首页', '/'],
  ['猫狗图鉴', '/animals'],
  ['论坛', '/forum'],
  ['求助', '/help'],
  ['领养', '/adoption'],
  ['科普知识', '/knowledge'],
  ['关于我们', '/about']
] as const;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuthFromCookies();
  const isLoggedIn = Boolean(auth);
  const isAdmin = auth?.role === 'admin';
  let nickname: string | undefined;

  if (isAdmin) {
    nickname = '管理员';
  } else if (auth?.userId) {
    const user = await query<{ name: string }>('SELECT name FROM users WHERE id=$1', [auth.userId]);
    nickname = user.rows[0]?.name;
  }

  const nav = isAdmin ? [...baseNav, ['管理后台', '/admin'] as const] : baseNav;

  return (
    <html lang="zh-CN">
      <body>
        <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
            <h1 className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">🐾 西财猫猫狗狗</h1>
            <nav className="flex flex-wrap gap-2 text-sm">
              {nav.map(([label, href]) => (
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
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
