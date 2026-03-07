'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostLikeButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function likePost() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error || '点赞失败，请先登录');
        return;
      }
      setMessage('已点赞');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={loading}
        onClick={likePost}
        className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white transition hover:bg-amber-600 disabled:opacity-70"
      >
        {loading ? '处理中…' : '点赞'}
      </button>
      <span className="text-sm text-slate-600">{message}</span>
    </div>
  );
}
