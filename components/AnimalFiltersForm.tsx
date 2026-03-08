'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AnimalFiltersForm({ q, species }: { q?: string; species?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-amber-900">筛选条件</h3>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white">
          {open ? '收起' : '展开筛选'}
        </button>
      </div>

      {open ? (
        <form className="mt-3 grid gap-3 md:grid-cols-4" method="GET">
          <input name="q" defaultValue={q || ''} className="rounded-xl border border-amber-200 px-3 py-2 md:col-span-2" placeholder="搜索名称或描述" />
          <select name="species" defaultValue={species || ''} className="rounded-xl border border-amber-200 px-3 py-2">
            <option value="">全部物种</option>
            <option value="cat">猫</option>
            <option value="dog">狗</option>
          </select>
          <div className="flex gap-2">
            <button className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white">筛选</button>
            <Link href="/animals" className="rounded-xl border border-amber-200 px-4 py-2 text-sm text-slate-700">重置</Link>
          </div>
        </form>
      ) : null}
    </section>
  );
}
