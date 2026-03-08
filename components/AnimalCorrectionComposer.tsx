'use client';

import { FormEvent, useState } from 'react';

export default function AnimalCorrectionComposer({ animalId }: { animalId: number }) {
  const [field, setField] = useState('description');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/animals/${animalId}/corrections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_name: field, suggested_value: value, reason })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setMessage(data?.error || '提交失败，请先登录');
      return;
    }
    setField('description');
    setValue('');
    setReason('');
    setOpen(false);
    setMessage('纠错建议已提交，管理员会审核处理。');
  }

  return (
    <section className="space-y-2 rounded-xl border border-amber-100 bg-white/90 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-amber-900">纠错/资料补充</p>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded bg-slate-800 px-3 py-1 text-sm text-white">
          {open ? '收起' : '提纠错'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="space-y-2">
          <select className="w-full rounded border border-amber-200 px-2 py-1 text-sm" value={field} onChange={(e) => setField(e.target.value)}>
            <option value="name">名称</option>
            <option value="description">描述</option>
            <option value="location">活动地点</option>
            <option value="active_time">活动时间</option>
          </select>
          <input className="w-full rounded border border-amber-200 px-2 py-1 text-sm" value={value} onChange={(e) => setValue(e.target.value)} placeholder="建议修改后的内容" required />
          <textarea className="w-full rounded border border-amber-200 px-2 py-1 text-sm" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="说明依据或观察来源" required />
          <button className="rounded bg-slate-800 px-3 py-1 text-sm text-white">提交纠错</button>
        </form>
      ) : null}

      <p className="text-sm text-slate-600">{message}</p>
    </section>
  );
}
