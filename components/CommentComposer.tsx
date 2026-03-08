'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentComposer({ postId }: { postId: number }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    try {
      const res = await fetch('/api/comments', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setMessage(data?.error || '评论失败，请先登录');
        return;
      }
      setMessage('评论成功');
      setContent('');
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-amber-900">发表评论</p>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white">
          {open ? '收起' : '写评论'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="space-y-2">
          <textarea
            rows={3}
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
            placeholder="写下你的看法..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button disabled={loading} className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white disabled:opacity-70">
            {loading ? '发布中…' : '发表评论'}
          </button>
        </form>
      ) : null}

      <p className={`min-h-5 text-sm ${message ? (isError ? 'text-rose-700' : 'text-emerald-700') : 'text-slate-500'}`}>{message}</p>
    </section>
  );
}
