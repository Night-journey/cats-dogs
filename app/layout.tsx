import './globals.css';
import type { Metadata } from 'next';
import { getAuthFromCookies } from '@/lib/auth';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
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

  const extraNav: [string, string][] = isAdmin ? [['管理后台', '/admin']] : [];

  return (
    <html lang="zh-CN">
      <body>
        <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} nickname={nickname} extraNav={extraNav} />
        <main className="mx-auto max-w-6xl px-4 py-8 pb-24">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
