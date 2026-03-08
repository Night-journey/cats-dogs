import ForumComposer from '@/components/ForumComposer';

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, { cache: 'no-store' });
  return res.json();
}

export default async function ForumPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 p-5">
        <h2 className="text-2xl font-bold text-rose-900">社区论坛</h2>
        <p className="mt-1 text-sm text-rose-700">像小红书一样浏览校园猫狗日常与救助故事</p>
      </div>

      <ForumComposer />

      <section>
        <h3 className="mb-3 text-lg font-semibold text-slate-800">最新动态</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((p: any) => (
            <a
              key={p.id}
              href={`/forum/${p.id}`}
              className="group block overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {p.image_urls?.[0] ? (
                <img src={p.image_urls[0]} alt={p.title} className="aspect-[3/4] w-full object-cover" />
              ) : (
                <div className="aspect-[3/4] w-full bg-gradient-to-br from-rose-100 to-amber-100" />
              )}
              <div className="space-y-2 p-4">
                <h4 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-rose-700">{p.title}</h4>
                <p className="line-clamp-2 text-sm text-slate-600">{p.content}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>@{p.author || '匿名'}</span>
                  <span>❤️ {p.likes_count}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
