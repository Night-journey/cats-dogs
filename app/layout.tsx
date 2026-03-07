import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campus Stray Animal Platform',
  description: 'Help stray cats and dogs on campus'
};

const nav = [
  ['Home', '/'],
  ['Animals', '/animals'],
  ['Forum', '/forum'],
  ['Help', '/help'],
  ['Adoption', '/adoption'],
  ['Knowledge', '/knowledge'],
  ['About', '/about'],
  ['Admin', '/admin']
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
            <h1 className="font-semibold">Campus Stray Animal Platform</h1>
            <nav className="flex flex-wrap gap-3 text-sm">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="text-slate-600 hover:text-blue-600">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex gap-3 text-sm">
              <Link href="/login" className="text-slate-600 hover:text-blue-600">Login</Link>
              <Link href="/register" className="text-slate-600 hover:text-blue-600">Register</Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
