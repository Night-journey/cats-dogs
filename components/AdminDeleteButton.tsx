'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDeleteButton({
  endpoint,
  label = '删除',
  redirectTo
}: {
  endpoint: string;
  label?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`确定要删除吗？此操作不可恢复。`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      } else {
        alert('删除失败');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-50"
    >
      {loading ? '删除中...' : label}
    </button>
  );
}
