'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostLikeButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function likePost() {
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setMessage(data?.error || '请先登录才能点赞');
        return;
      }
      setMessage('已点赞 ❤️');
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
        {loading ? '处理中…' : '👍 点赞'}
      </button>
      {message && (
        <span className={`text-sm ${isError ? 'text-rose-600 font-medium' : 'text-emerald-600'}`}>
          {message}
        </span>
      )}
    </div>
  );
}
