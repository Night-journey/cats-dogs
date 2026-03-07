'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statuses = ['open', 'processing', 'closed'];

export default function HelpStatusControl({ id, current }: { id: number; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    setLoading(true);
    try {
      await fetch(`/api/help-requests/${id}`, {
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
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border border-amber-200 px-2 py-1 text-sm">
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button disabled={loading} onClick={updateStatus} className="rounded bg-slate-800 px-2 py-1 text-xs text-white disabled:opacity-70">
        {loading ? '保存中…' : '更新状态'}
      </button>
    </div>
  );
}
