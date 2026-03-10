'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdoptionPostStatusControl({ id, current }: { id: number; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current || 'pending');
  const [loading, setLoading] = useState(false);

  async function onUpdate() {
    setLoading(true);
    try {
      await fetch(`/api/adoption-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <select className="rounded border border-amber-200 px-2 py-1 text-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">待审核</option>
        <option value="approved">已通过</option>
        <option value="rejected">已拒绝</option>
      </select>
      <button disabled={loading} onClick={onUpdate} className="rounded bg-slate-800 px-2 py-1 text-xs text-white disabled:opacity-70">
        {loading ? '保存中…' : '更新状态'}
      </button>
    </div>
  );
}
