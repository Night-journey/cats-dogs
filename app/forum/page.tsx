async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/posts`, { cache: 'no-store' });
  return res.json();
}

export default async function ForumPage() {
  const posts = await getPosts();
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">社区论坛</h2>
      <div className="space-y-4">
        {posts.map((p: any) => (
          <a key={p.id} href={`/forum/${p.id}`} className="block rounded-xl border bg-white p-4">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-slate-500">作者：{p.author} · {p.likes_count} 次点赞</p>
            <p className="line-clamp-2 text-sm">{p.content}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
