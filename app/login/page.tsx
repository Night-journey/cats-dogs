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

    if (!res.ok) {
      setMessage('登录失败');
      return;
    }

    setMessage('登录成功');
    router.push(account === 'admin' ? '/admin' : '/');
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded border bg-white p-6">
      <h2 className="text-xl font-semibold">登录</h2>
      <input className="w-full rounded border p-2" placeholder="账号（管理员账号：admin）" value={account} onChange={(e) => setAccount(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-blue-600 p-2 text-white">登录</button>
      <p className="text-sm text-slate-500">管理员默认账号：admin，密码：1234</p>
      <p className="text-sm">{message}</p>
    </form>
  );
}
