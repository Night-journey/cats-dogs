'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthActions({ isLoggedIn, isAdmin }: { isLoggedIn: boolean; isAdmin: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="ml-auto flex gap-2 text-sm">
        <Link href="/login" className="rounded-full px-3 py-1 text-slate-700 transition hover:bg-amber-100 hover:text-amber-900">登录</Link>
        <Link href="/register" className="rounded-full bg-amber-500 px-3 py-1 text-white transition hover:bg-amber-600">注册</Link>
      </div>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-2 text-sm">
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">已登录</span>
      {isAdmin ? (
        <Link href="/admin" className="rounded-full px-3 py-1 text-slate-700 transition hover:bg-amber-100 hover:text-amber-900">
          管理后台
        </Link>
      ) : null}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="rounded-full bg-rose-500 px-3 py-1 text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? '退出中…' : '退出登录'}
      </button>
    </div>
  );
}
