'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdoptionPostComposer() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [species, setSpecies] = useState('cat');
  const [description, setDescription] = useState('');
  const [healthInfo, setHealthInfo] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/adoption-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, animal_name: animalName, species, description, health_info: healthInfo, contact_info: contactInfo })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setMessage(data?.error || '发布失败，请先登录');
      return;
    }
    setTitle('');
    setAnimalName('');
    setDescription('');
    setHealthInfo('');
    setContactInfo('');
    setMessage('送养信息已提交，等待管理员审核');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
      <h3 className="font-semibold text-amber-900">发布送养信息</h3>
      <input className="w-full rounded border border-amber-200 px-2 py-1 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="送养标题" required />
      <div className="grid gap-2 md:grid-cols-2">
        <input className="rounded border border-amber-200 px-2 py-1 text-sm" value={animalName} onChange={(e) => setAnimalName(e.target.value)} placeholder="动物名字" required />
        <select className="rounded border border-amber-200 px-2 py-1 text-sm" value={species} onChange={(e) => setSpecies(e.target.value)}>
          <option value="cat">猫</option>
          <option value="dog">狗</option>
        </select>
      </div>
      <textarea className="w-full rounded border border-amber-200 px-2 py-1 text-sm" rows={2} value={healthInfo} onChange={(e) => setHealthInfo(e.target.value)} placeholder="健康状况" />
      <textarea className="w-full rounded border border-amber-200 px-2 py-1 text-sm" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="送养说明" required />
      <input className="w-full rounded border border-amber-200 px-2 py-1 text-sm" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="联系方式" required />
      <button className="rounded bg-emerald-600 px-3 py-1 text-sm text-white">发布送养</button>
      <p className="text-sm text-slate-600">{message}</p>
    </form>
  );
}
