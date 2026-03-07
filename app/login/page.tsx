'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    setMessage(res.ok ? '登录成功' : '登录失败');
    if (res.ok) router.push('/');
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded border bg-white p-6">
      <h2 className="text-xl font-semibold">登录</h2>
      <input className="w-full rounded border p-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-blue-600 p-2 text-white">登录</button>
      <p className="text-sm">{message}</p>
    </form>
  );
}
