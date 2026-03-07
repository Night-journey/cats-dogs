import Link from 'next/link';
import { getAuthFromCookies } from '@/lib/auth';

async function getArticle(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/articles/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function ArticleDetail({ params }: { params: { id: string } }) {
  const [article, auth] = await Promise.all([getArticle(params.id), getAuthFromCookies()]);
  const isAdmin = auth?.role === 'admin';

  return (
    <article className="rounded border bg-white p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{article.title}</h2>
          <p className="text-sm text-slate-500">{article.category}</p>
        </div>
        {isAdmin ? (
          <Link href={`/knowledge/${article.id}/edit`} className="rounded border border-amber-300 px-3 py-1 text-sm text-amber-800">
            编辑文章
          </Link>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap">{article.content}</p>
    </article>
  );
}
