'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    setMessage(res.ok ? '注册成功' : '注册失败');
    if (res.ok) router.push('/login');
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded border bg-white p-6">
      <h2 className="text-xl font-semibold">注册</h2>
      <input className="w-full rounded border p-2" placeholder="昵称" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-blue-600 p-2 text-white">注册</button>
      <p className="text-sm">{message}</p>
    </form>
  );
}
