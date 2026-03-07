'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForumComposer() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    try {
      const res = await fetch('/api/posts', {
    credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, image_urls: [] })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setMessage(data?.error || '发布失败，请先登录后重试');
        return;
      }

      setMessage('发布成功！');
      setTitle('');
      setContent('');
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
          <h3 className="font-semibold text-amber-900">发布新帖子</h3>
          <p className="text-sm text-slate-600">分享救助进展、求助线索或照护经验。</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
        >
          {open ? '收起' : '发帖'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl border border-amber-200 px-3 py-2"
            placeholder="帖子标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded-xl border border-amber-200 px-3 py-2"
            rows={4}
            placeholder="说点什么吧..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button disabled={loading} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
            {loading ? '发布中…' : '立即发布'}
          </button>
        </form>
      ) : null}

      <p className={`mt-3 min-h-6 text-sm ${message ? `${isError ? 'text-rose-700' : 'text-emerald-700'}` : 'text-slate-500'}`}>{message}</p>
    </section>
  );
}
