'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password })
    });
    setMessage(res.ok ? '登录成功，正在进入管理面板…' : '登录失败，请检查账号或密码');
    if (res.ok) router.push(account === 'admin' ? '/admin' : '/');
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <div className="grid items-stretch gap-6 overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 shadow-lg sm:gap-0 md:grid-cols-2">
        <section className="hidden flex-col justify-between p-8 md:flex">
          <div className="space-y-4">
            <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-amber-700">校园流浪动物平台</p>
            <h1 className="text-3xl font-bold leading-tight text-amber-900">欢迎回来，<br />一起守护毛孩子</h1>
            <p className="text-sm leading-6 text-amber-800/80">使用管理员账号即可进入管理界面，快速处理领养、求助与内容审核。</p>
          </div>
          <p className="text-xs text-amber-700/80">管理员账号：admin · 密码：1234</p>
        </section>

        <form onSubmit={onSubmit} className="space-y-4 bg-white/80 p-5 backdrop-blur-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-amber-900">登录</h2>
          <p className="text-sm text-slate-600">请使用账号和密码登录，支持手机端与电脑端操作。</p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">账号</label>
            <input
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="管理员请输入 admin"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
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
            />
          </div>

          <button className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 font-medium text-white shadow transition hover:from-amber-600 hover:to-orange-600">登录</button>

          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">管理员初始账号：admin，密码：1234</p>
          <p className="min-h-6 text-sm text-slate-700">{message}</p>
        </form>
      </div>
    </div>
  );
}
