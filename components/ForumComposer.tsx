'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForumComposer() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  async function onUploadImage(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setIsError(false);
    setMessage('');

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('kind', 'post');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.url) {
          setIsError(true);
          if (res.status === 401) {
            setMessage('请先登录');
          } else {
            setMessage(data?.message || '图片上传失败，请重试');
          }
          return;
        }
        uploaded.push(data.url);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
      setMessage(`已上传 ${uploaded.length} 张图片`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    setMessage('');

    if (!title.trim() || !content.trim() || imageUrls.length === 0) {
      setIsError(true);
      setMessage('请完整填写标题、正文，并至少上传一张图片');
      setLoading(false);
      return;
    }

    if (title.trim().length > 25) {
      setIsError(true);
      setMessage('标题不能超过25个字');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), image_urls: imageUrls })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || '发布失败，请先登录后重试');
        return;
      }

      setMessage('发布成功！');
      setTitle('');
      setContent('');
      setImageUrls([]);
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-amber-900">发布新笔记</h3>
          <p className="text-sm text-slate-600">必须包含：标题、正文和至少一张图片。</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
        >
          {open ? '收起' : '发笔记'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="relative">
            <input
              className="w-full rounded-xl border border-amber-200 px-3 py-2 pr-14"
              placeholder="帖子标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${title.length > 25 ? 'text-rose-600 font-medium' : 'text-slate-400'}`}>
              {title.length}/25
            </span>
          </div>
          <textarea
            className="w-full rounded-xl border border-amber-200 px-3 py-2"
            rows={4}
            placeholder="说点什么吧..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
            <p className="text-sm text-amber-800">上传帖子图片（至少 1 张）</p>
            <input type="file" accept="image/*" multiple onChange={onUploadImage} disabled={uploading || loading} className="block w-full text-sm" />
            {imageUrls.length ? (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {imageUrls.map((url) => (
                  <div key={url} className="relative overflow-hidden rounded-lg border">
                    <img src={url} alt="帖子图片" className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute right-1 top-1 rounded bg-white/90 px-2 py-0.5 text-xs text-rose-700"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <button disabled={loading || uploading} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
            {loading ? '发布中…' : '立即发布'}
          </button>
        </form>
      ) : null}

      <p className={`mt-3 min-h-6 text-sm ${message ? `${isError ? 'text-rose-700' : 'text-emerald-700'}` : 'text-slate-500'}`}>{uploading ? '图片上传中…' : message}</p>
    </section>
  );
}
