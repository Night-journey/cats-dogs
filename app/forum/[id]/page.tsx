async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/posts/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  return (
    <div className="space-y-4 rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="text-sm text-slate-500">作者：{post.author} · 点赞：{post.likes_count}</p>
      <p>{post.content}</p>
      <div>
        <h3 className="mb-2 font-semibold">评论区</h3>
        <div className="space-y-2">
          {post.comments?.map((c: any) => (
            <div key={c.id} className="rounded border p-2 text-sm">
              <p className="font-medium">{c.author}</p>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
