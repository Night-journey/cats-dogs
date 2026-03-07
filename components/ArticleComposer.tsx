'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  mode: 'create' | 'edit';
  articleId?: number;
  initialTitle?: string;
  initialCategory?: string;
  initialContent?: string;
};

export default function ArticleComposer({ mode, articleId, initialTitle = '', initialCategory = '', initialContent = '' }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState(initialCategory);
  const [content, setContent] = useState(initialContent);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(mode === 'create' ? '/api/articles' : `/api/articles/${articleId}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.message || '保存失败');
        return;
      }
      setMessage('保存成功');
      router.push(`/knowledge/${data.id || articleId}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (mode !== 'edit' || !articleId) return;
    setLoading(true);
    try {
      await fetch(`/api/articles/${articleId}`, { method: 'DELETE' });
      router.push('/knowledge');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
      <h3 className="font-semibold text-amber-900">{mode === 'create' ? '新增知识文章' : '编辑知识文章'}</h3>
      <input className="w-full rounded-xl border border-amber-200 px-3 py-2" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input className="w-full rounded-xl border border-amber-200 px-3 py-2" placeholder="分类" value={category} onChange={(e) => setCategory(e.target.value)} required />
      <textarea className="w-full rounded-xl border border-amber-200 px-3 py-2" rows={8} placeholder="正文" value={content} onChange={(e) => setContent(e.target.value)} required />
      <div className="flex items-center gap-2">
        <button disabled={loading} className="rounded bg-amber-500 px-3 py-1 text-sm text-white disabled:opacity-70">{loading ? '提交中…' : '保存文章'}</button>
        {mode === 'edit' ? (
          <button type="button" disabled={loading} onClick={onDelete} className="rounded border border-rose-300 px-3 py-1 text-sm text-rose-700 disabled:opacity-70">
            删除文章
          </button>
        ) : null}
      </div>
      <p className="text-sm text-slate-600">{message}</p>
    </form>
  );
}
