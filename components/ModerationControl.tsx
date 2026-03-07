'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ModerationControl({
  id,
  current,
  updateEndpoint,
  deleteEndpoint
}: {
  id: number;
  current: string;
  updateEndpoint: string;
  deleteEndpoint: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current || 'pending');
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      await fetch(updateEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(deleteEndpoint, { method: 'DELETE' });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <select className="rounded border border-amber-200 px-2 py-1 text-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
      </select>
      <button disabled={loading} onClick={handleUpdate} className="rounded bg-slate-800 px-2 py-1 text-xs text-white disabled:opacity-70">
        更新
      </button>
      <button disabled={loading} onClick={handleDelete} className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-70">
        删除
      </button>
    </div>
  );
}
