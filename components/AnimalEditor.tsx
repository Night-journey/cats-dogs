'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Animal = {
  id: number;
  avatar_url?: string;
  name: string;
  alias?: string;
  species: string;
  coat_color?: string;
  gender?: string;
  age?: string;
  neutered?: boolean;
  location?: string;
  active_time?: string;
  personality_tags?: string[];
  feeding_guide?: string;
  description?: string;
  anecdotes?: string;
  social_notes?: string;
  adoption_status?: string;
};

type FormState = {
  avatarUrl: string;
  name: string;
  alias: string;
  species: 'cat' | 'dog';
  coatColor: string;
  gender: '妹妹' | '弟弟';
  age: string;
  neutered: boolean;
  location: string;
  activeTime: string;
  personalityTags: string;
  feedingGuide: string;
  description: string;
  anecdotes: string;
  socialNotes: string;
  adoptionStatus: string;
};

function animalToForm(animal: Animal): FormState {
  return {
    avatarUrl: animal.avatar_url || '',
    name: animal.name || '',
    alias: animal.alias || '',
    species: animal.species === 'dog' ? 'dog' : 'cat',
    coatColor: animal.coat_color || '',
    gender: animal.gender === '妹妹' ? '妹妹' : '弟弟',
    age: animal.age || '',
    neutered: animal.neutered || false,
    location: animal.location || '',
    activeTime: animal.active_time || '',
    personalityTags: animal.personality_tags?.join(', ') || '',
    feedingGuide: animal.feeding_guide || '',
    description: animal.description || '',
    anecdotes: animal.anecdotes || '',
    socialNotes: animal.social_notes || '',
    adoptionStatus: animal.adoption_status || 'campus_resident'
  };
}

export default function AnimalEditor({ animal }: { animal: Animal }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(animalToForm(animal));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onUploadAvatar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', 'animal');

      const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        if (res.status === 401) {
          setMessage('请先登录');
        } else {
          setMessage(data?.message || '头像上传失败');
        }
        return;
      }
      setForm((prev) => ({ ...prev, avatarUrl: data.url }));
      setMessage('头像上传成功');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        avatar_url: form.avatarUrl,
        name: form.name,
        alias: form.alias,
        species: form.species,
        coat_color: form.coatColor,
        gender: form.gender,
        age: form.age,
        neutered: form.neutered,
        location: form.location,
        active_time: form.activeTime,
        personality_tags: form.personalityTags
          .split(/[，,]/)
          .map((tag) => tag.trim())
          .filter(Boolean),
        feeding_guide: form.feedingGuide,
        description: form.description,
        anecdotes: form.anecdotes,
        social_notes: form.socialNotes,
        adoption_status: form.adoptionStatus
      };

      const res = await fetch(`/api/animals/${animal.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.message || '更新失败，请确认有管理员权限');
        return;
      }

      setMessage('动物档案更新成功，正在跳转…');
      router.push(`/animals/${animal.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="动物名称（如：胖橘）" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="别名（如：大橘、橘总）" value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} />
        <select className="rounded-xl border border-amber-200 px-3 py-2" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value as 'cat' | 'dog' })}>
          <option value="cat">猫</option>
          <option value="dog">狗</option>
        </select>
        <select className="rounded-xl border border-amber-200 px-3 py-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as '妹妹' | '弟弟' })}>
          <option value="妹妹">妹妹</option>
          <option value="弟弟">弟弟</option>
        </select>
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="花色" value={form.coatColor} onChange={(e) => setForm({ ...form, coatColor: e.target.value })} />
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="预估年龄（如 3岁）" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="常驻地点" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="活跃时间（如 全天活跃）" value={form.activeTime} onChange={(e) => setForm({ ...form, activeTime: e.target.value })} />
        <select className="rounded-xl border border-amber-200 px-3 py-2 md:col-span-2" value={form.adoptionStatus} onChange={(e) => setForm({ ...form, adoptionStatus: e.target.value })}>
          <option value="campus_resident">在校活跃</option>
          <option value="adopted">被领养</option>
          <option value="medical">就医中</option>
          <option value="deceased">在喵星</option>
        </select>
      </div>

      <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
        <p className="text-sm text-amber-800">上传本地头像</p>
        <input type="file" accept="image/*" onChange={onUploadAvatar} className="block w-full text-sm" disabled={uploading || loading} />
        <input className="w-full rounded-xl border border-amber-200 px-3 py-2" placeholder="头像 URL（上传后自动填充）" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
        {form.avatarUrl ? <img src={form.avatarUrl} alt="头像预览" className="aspect-[3/4] w-28 rounded-xl border object-cover" /> : null}
      </div>

      <input className="w-full rounded-xl border border-amber-200 px-3 py-2" placeholder="性格标签（逗号分隔，例如 亲人,贪吃,可抱）" value={form.personalityTags} onChange={(e) => setForm({ ...form, personalityTags: e.target.value })} />
      <textarea className="w-full rounded-xl border border-amber-200 px-3 py-2" rows={3} placeholder="投喂指南" value={form.feedingGuide} onChange={(e) => setForm({ ...form, feedingGuide: e.target.value })} />
      <textarea className="w-full rounded-xl border border-amber-200 px-3 py-2" rows={3} placeholder="介绍" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <textarea className="w-full rounded-xl border border-amber-200 px-3 py-2" rows={2} placeholder="趣闻轶事" value={form.anecdotes} onChange={(e) => setForm({ ...form, anecdotes: e.target.value })} />
      <textarea className="w-full rounded-xl border border-amber-200 px-3 py-2" rows={2} placeholder="人际关系" value={form.socialNotes} onChange={(e) => setForm({ ...form, socialNotes: e.target.value })} />

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={form.neutered} onChange={(e) => setForm({ ...form, neutered: e.target.checked })} />
        已绝育
      </label>

      <div className="flex items-center gap-3">
        <button disabled={loading || uploading} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
          {loading ? '保存中…' : '保存修改'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700">
          取消
        </button>
      </div>

      <p className="text-sm text-slate-600">{uploading ? '图片上传中…' : message}</p>
    </form>
  );
}
