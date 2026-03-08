'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnimalNoteComposer({ animalId }: { animalId: number }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/animals/${animalId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error || '提交失败，请先登录');
        return;
      }
      setMessage('已提交，待管理员审核后展示');
      setContent('');
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-2 rounded-xl border border-amber-100 bg-white/90 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-amber-900">提交观察笔记</p>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded bg-amber-500 px-3 py-1 text-sm text-white">
          {open ? '收起' : '写笔记'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="space-y-2">
          <textarea className="w-full rounded border border-amber-200 px-3 py-2 text-sm" rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="补充你的观察笔记（需审核）" required />
          <button disabled={loading} className="rounded bg-amber-500 px-3 py-1 text-sm text-white disabled:opacity-70">{loading ? '提交中…' : '提交笔记'}</button>
        </form>
      ) : null}

      <p className="text-sm text-slate-600">{message}</p>
    </section>
  );
}
