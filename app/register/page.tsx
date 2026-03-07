'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || '注册失败，请稍后重试');
        return;
      }

      setMessage('注册成功！正在跳转到登录页...');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => router.replace('/login'), 900);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-amber-900">注册账号</h2>
      <input className="w-full rounded-xl border border-amber-200 px-3 py-2" placeholder="昵称" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="w-full rounded-xl border border-amber-200 px-3 py-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full rounded-xl border border-amber-200 px-3 py-2" type="password" placeholder="密码（至少 4 位）" value={password} onChange={(e) => setPassword(e.target.value)} minLength={4} required />
      <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 text-white transition hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70">{loading ? '注册中…' : '注册'}</button>
      <p className={`min-h-6 text-sm ${message ? `rounded-lg px-2 py-1 ${isError ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}` : 'text-slate-500'}`}>{message}</p>
    </form>
  );
}
