'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginResponse = {
  message: string;
  role?: 'user' | 'admin';
  redirect?: string;
};

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
    const data = (await res.json()) as LoginResponse;
    setMessage(data.message || (res.ok ? '登录成功' : '登录失败，请检查账号密码'));
    if (res.ok) router.push(data.redirect || '/');
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded border bg-white p-6">
      <h2 className="text-xl font-semibold">登录</h2>
      <input className="w-full rounded border p-2" placeholder="账号（普通用户填邮箱，管理员填 admin）" value={account} onChange={(e) => setAccount(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-blue-600 p-2 text-white">立即登录</button>
      <p className="text-sm">{message}</p>
      <p className="text-xs text-slate-500">管理员初始账号：admin / 1234</p>
    </form>
  );
}
