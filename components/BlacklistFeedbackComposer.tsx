'use client';

import { FormEvent, useState } from 'react';

export default function BlacklistFeedbackComposer() {
  const [suspectName, setSuspectName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/adoption-blacklist-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspect_name: suspectName, contact_info: contactInfo, reason, evidence })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setMessage(data?.error || '提交失败，请先登录');
      return;
    }
    setSuspectName('');
    setContactInfo('');
    setReason('');
    setEvidence('');
    setOpen(false);
    setMessage('反馈已提交，管理员将审核处理');
  }

  return (
    <section className="space-y-2 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-amber-900">不良领养人反馈</h3>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded bg-rose-600 px-3 py-1 text-sm text-white">
          {open ? '收起' : '提交反馈'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="space-y-2">
          <input className="w-full rounded border border-amber-200 px-2 py-1 text-sm" value={suspectName} onChange={(e) => setSuspectName(e.target.value)} placeholder="被投诉人姓名" required />
          <input className="w-full rounded border border-amber-200 px-2 py-1 text-sm" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="联系方式（可选）" />
          <textarea className="w-full rounded border border-amber-200 px-2 py-1 text-sm" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="投诉原因" required />
          <textarea className="w-full rounded border border-amber-200 px-2 py-1 text-sm" rows={2} value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="证据描述（聊天记录、现场情况等）" />
          <button className="rounded bg-rose-600 px-3 py-1 text-sm text-white">确认提交</button>
        </form>
      ) : null}

      <p className="text-sm text-slate-600">{message}</p>
    </section>
  );
}
