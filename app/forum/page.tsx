import ForumComposer from '@/components/ForumComposer';
import DeleteButton from '@/components/DeleteButton';
import { getAuthFromCookies } from '@/lib/auth';

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, { cache: 'no-store' });
  return res.json();
}

export default async function ForumPage() {
  const [posts, auth] = await Promise.all([getPosts(), getAuthFromCookies()]);
  const userId = auth?.userId;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 p-6 text-white">
        <div className="absolute -right-4 -top-4 text-9xl opacity-10">🐱</div>
        <div className="absolute -bottom-6 -left-6 text-8xl opacity-10">🐕</div>
        <h2 className="relative text-2xl font-bold">社区论坛</h2>
        <p className="relative mt-1 text-sm text-white/80">分享校园猫狗的日常与救助故事</p>
      </div>

      <ForumComposer />

      <section>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-5xl">📝</div>
            <p className="text-slate-600">还没有帖子</p>
            <p className="text-sm text-slate-500">快来分享第一个故事吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((p: any) => (
              <a
                key={p.id}
                href={`/forum/${p.id}`}
                className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {p.image_urls?.[0] ? (
                  <div className="relative">
                    <img src={p.image_urls[0]} alt={p.title} className="aspect-[3/4] w-full object-cover" />
                    {p.image_urls.length > 1 && (
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                        {p.image_urls.length} 图
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[3/4] w-full bg-gradient-to-br from-rose-100 to-amber-100" />
                )}
                <div className="space-y-2 p-3">
                  <h4 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-rose-600" title={p.title}>
                  {p.title.length > 25 ? p.title.slice(0, 25) + '...' : p.title}
                </h4>
                  <p className="line-clamp-2 text-xs text-slate-500">{p.content}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">@{p.author || '匿名'}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-rose-500">❤️ {p.likes_count}</span>
                      {userId === p.author_id && (
                        <DeleteButton endpoint={`/api/posts?id=${p.id}`} label="删除" />
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
