import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '校园流浪动物平台',
  description: '一起帮助校园流浪猫狗'
};

const nav = [
  ['首页', '/'],
  ['动物图鉴', '/animals'],
  ['论坛', '/forum'],
  ['求助', '/help'],
  ['领养', '/adoption'],
  ['科普知识', '/knowledge'],
  ['关于我们', '/about'],
  ['管理后台', '/admin']
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
            <h1 className="font-semibold">校园流浪动物平台</h1>
            <nav className="flex flex-wrap gap-3 text-sm">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="text-slate-600 hover:text-blue-600">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex gap-3 text-sm">
              <Link href="/login" className="text-slate-600 hover:text-blue-600">登录</Link>
              <Link href="/register" className="text-slate-600 hover:text-blue-600">注册</Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
