'use client';

import { FormEvent, useState } from 'react';

type AdoptionRequest = {
  id: number;
  animal_name?: string;
  applicant_name: string;
  status: string;
};

export default function AdminConsole() {
  const [animalName, setAnimalName] = useState('');
  const [animalSpecies, setAnimalSpecies] = useState<'cat' | 'dog'>('cat');
  const [animalDesc, setAnimalDesc] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [message, setMessage] = useState('');
  const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);

  async function createAnimal(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: animalName, species: animalSpecies, description: animalDesc })
    });
    setMessage(res.ok ? '动物信息已新增' : '新增失败');
  }

  async function createArticle(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: articleTitle, content: articleContent, category: '救助指南' })
    });
    setMessage(res.ok ? '文章已发布' : '发布失败');
  }

  async function loadAdoptions() {
    const res = await fetch('/api/adoption-requests');
    const data = await res.json();
    setAdoptions(data);
  }

  async function updateAdoptionStatus(id: number, status: 'approved' | 'rejected') {
    const res = await fetch(`/api/adoption-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setMessage(res.ok ? '申请状态已更新' : '更新失败');
    if (res.ok) loadAdoptions();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">管理员操作台</h2>

      <form onSubmit={createAnimal} className="space-y-2 rounded border bg-white p-4">
        <h3 className="font-semibold">新增动物</h3>
        <input className="w-full rounded border p-2" placeholder="名称" value={animalName} onChange={(e) => setAnimalName(e.target.value)} />
        <select className="w-full rounded border p-2" value={animalSpecies} onChange={(e) => setAnimalSpecies(e.target.value as 'cat' | 'dog')}>
          <option value="cat">猫</option>
          <option value="dog">狗</option>
        </select>
        <textarea className="w-full rounded border p-2" placeholder="描述" value={animalDesc} onChange={(e) => setAnimalDesc(e.target.value)} />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">提交</button>
      </form>

      <form onSubmit={createArticle} className="space-y-2 rounded border bg-white p-4">
        <h3 className="font-semibold">发布知识文章</h3>
        <input className="w-full rounded border p-2" placeholder="标题" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} />
        <textarea className="w-full rounded border p-2" placeholder="正文" value={articleContent} onChange={(e) => setArticleContent(e.target.value)} />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">发布</button>
      </form>

      <section className="space-y-2 rounded border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">领养申请审批</h3>
          <button className="rounded border px-3 py-1 text-sm" onClick={loadAdoptions} type="button">刷新列表</button>
        </div>
        <div className="space-y-2">
          {adoptions.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-2 rounded border p-2 text-sm">
              <span>#{item.id}</span>
              <span>动物：{item.animal_name || '-'}</span>
              <span>申请人：{item.applicant_name}</span>
              <span>状态：{item.status}</span>
              <button className="rounded bg-green-600 px-2 py-1 text-white" onClick={() => updateAdoptionStatus(item.id, 'approved')} type="button">通过</button>
              <button className="rounded bg-red-600 px-2 py-1 text-white" onClick={() => updateAdoptionStatus(item.id, 'rejected')} type="button">拒绝</button>
            </div>
          ))}
        </div>
      </section>

      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
}
