import ForumComposer from '@/components/ForumComposer';

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, { cache: 'no-store' });
  return res.json();
}

export default async function ForumPage() {
  const posts = await getPosts();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">社区论坛</h2>
      <ForumComposer />
      <div className="space-y-4">
        {posts.map((p: any) => (
          <a key={p.id} href={`/forum/${p.id}`} className="block rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="font-semibold text-slate-900">{p.title}</h3>
            <p className="text-sm text-amber-700">作者：{p.author} · {p.likes_count} 次点赞</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-700">{p.content}</p>
            {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt={p.title} className="mt-2 h-44 w-full rounded-xl object-cover" /> : null}
          </a>
        ))}
      </div>
    </div>
  );
}
