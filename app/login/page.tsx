'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setMessage(data?.error || '登录失败，请检查账号或密码');
        return;
      }

      setMessage('登录成功，正在跳转...');
      setTimeout(() => {
        router.replace(account === 'admin' ? '/admin' : '/');
        router.refresh();
      }, 700);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <div className="grid items-stretch gap-6 overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 shadow-lg sm:gap-0 md:grid-cols-2">
        <section className="hidden flex-col justify-between p-8 md:flex">
          <div className="space-y-4">
            <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-amber-700">校园流浪动物平台</p>
            <h1 className="text-3xl font-bold leading-tight text-amber-900">欢迎回来，<br />一起守护毛孩子</h1>
            <p className="text-sm leading-6 text-amber-800/80">登录后可发布求助、参与论坛互动并跟进领养进度。</p>
          </div>
          <p className="text-xs text-amber-700/80">感谢你加入，一起为校园流浪动物提供温暖支持。</p>
        </section>

        <form onSubmit={onSubmit} className="space-y-4 bg-white/80 p-5 backdrop-blur-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-amber-900">登录</h2>
          <p className="text-sm text-slate-600">请使用账号和密码登录，支持手机端与电脑端操作。</p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">账号</label>
            <input
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="请输入邮箱或账号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">密码</label>
            <input
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 font-medium text-white shadow transition hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70">{loading ? '登录中…' : '登录'}</button>

          <p className={`min-h-6 text-sm ${message ? `rounded-lg px-2 py-1 ${isError ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}` : 'text-slate-500'}`}>{message}</p>
        </form>
      </div>
    </div>
  );
}
