'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statuses = ['open', 'processing', 'closed'];

export default function HelpStatusControl({ id, current, isAdmin, urgentLevel = 0, pinned = false }: { id: number; current: string; isAdmin: boolean; urgentLevel?: number; pinned?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [urgent, setUrgent] = useState(urgentLevel);
  const [isPinned, setIsPinned] = useState(pinned);
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    setLoading(true);
    try {
      await fetch(`/api/help-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, urgent_level: urgent, is_pinned: isPinned })
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
      {isAdmin ? (
        <>
          <select value={urgent} onChange={(e) => setUrgent(Number(e.target.value))} className="rounded border border-amber-200 px-2 py-1 text-sm">
            <option value={0}>普通</option>
            <option value={1}>紧急</option>
            <option value={2}>非常紧急</option>
          </select>
          <label className="flex items-center gap-1 text-xs text-slate-700">
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} /> 置顶
          </label>
        </>
      ) : null}
      <button disabled={loading} onClick={updateStatus} className="rounded bg-slate-800 px-2 py-1 text-xs text-white disabled:opacity-70">
        {loading ? '保存中…' : '更新状态'}
      </button>
    </div>
  );
}
