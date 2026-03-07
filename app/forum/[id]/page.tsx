import CommentComposer from '@/components/CommentComposer';
import PostLikeButton from '@/components/PostLikeButton';

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  return (
    <div className="space-y-4 rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="text-sm text-slate-500">作者：{post.author} · {post.likes_count} 次点赞</p>
      <PostLikeButton postId={post.id} />
      <p>{post.content}</p>
      {post.image_urls?.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {post.image_urls.map((url: string) => (
            <img key={url} src={url} alt={post.title} className="h-60 w-full rounded-xl object-cover" />
          ))}
        </div>
      ) : null}
      <div>
        <h3 className="mb-2 font-semibold">评论</h3>
        <CommentComposer postId={post.id} />
        <div className="mt-3 space-y-2">
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
