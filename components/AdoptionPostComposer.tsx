'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdoptionPostComposer() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [species, setSpecies] = useState('cat');
  const [description, setDescription] = useState('');
  const [healthInfo, setHealthInfo] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  function onPickImages(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages(files);
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', 'post');

    const res = await fetch('/api/upload', {
      credentials: 'include',
      method: 'POST',
      body: formData
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('请先登录');
      }
      throw new Error(data?.error || `上传失败 (${res.status})`);
    }
    if (!data?.url) {
      throw new Error('图片上传失败');
    }
    return data.url as string;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!images.length) {
      setMessage('请至少上传一张图片');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const imageUrls = await Promise.all(images.map((file) => uploadImage(file)));
      const res = await fetch('/api/adoption-posts', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          animal_name: animalName,
          species,
          description,
          health_info: healthInfo,
          contact_info: contactInfo,
          image_urls: imageUrls
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error || `发布失败 (${res.status})`);
        return;
      }
      setTitle('');
      setAnimalName('');
      setDescription('');
      setHealthInfo('');
      setContactInfo('');
      setImages([]);
      setOpen(false);
      setMessage('送养信息已提交，等待管理员审核');
      router.refresh();
    } catch (error) {
      const err = error as Error;
      setMessage(err.message || '提交失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="space-y-2 rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-amber-900">发布送养信息</h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"
        >
          {open ? '收起' : '发布送养'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="space-y-2">
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
          <label className="block text-sm text-slate-700">
            上传图片（至少一张）
            <input className="mt-1 block w-full rounded border border-amber-200 px-2 py-1 text-sm" type="file" accept="image/*" multiple onChange={onPickImages} required />
          </label>
          {images.length ? <p className="text-xs text-slate-600">已选择 {images.length} 张图片</p> : null}
          <button disabled={uploading} className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-70">{uploading ? '提交中…' : '提交送养信息'}</button>
        </form>
      ) : null}

      <p className="text-sm text-slate-600">{message}</p>
    </section>
  );
}
