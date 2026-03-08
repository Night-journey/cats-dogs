'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HelpRequestComposer() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('受伤救助');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    try {
      const res = await fetch('/api/help-requests', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          location,
          contact_info: contact,
          image_urls: []
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setMessage(data?.error || '发布失败，请先登录');
        return;
      }
      setMessage('求助发布成功！');
      setTitle('');
      setDescription('');
      setLocation('');
      setContact('');
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-amber-900">发布求助</h3>
          <p className="mt-1 text-sm text-slate-600">填写信息后，志愿者可更快联系并到场处理。</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
        >
          {open ? '收起' : '发布求助'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="求助标题" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="位置（如：图书馆北门）" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <select className="rounded-xl border border-amber-200 px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
            <option>受伤救助</option>
            <option>临时喂养</option>
            <option>走失/异常行为</option>
            <option>其他</option>
          </select>
          <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="联系方式" value={contact} onChange={(e) => setContact(e.target.value)} required />
          <textarea className="rounded-xl border border-amber-200 px-3 py-2 md:col-span-2" rows={4} placeholder="详细描述现场情况" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <button disabled={loading} className="w-fit rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
            {loading ? '提交中…' : '提交求助'}
          </button>
        </form>
      ) : null}

      <p className={`mt-2 min-h-6 text-sm ${message ? (isError ? 'text-rose-700' : 'text-emerald-700') : 'text-slate-500'}`}>{message}</p>
    </section>
  );
}
