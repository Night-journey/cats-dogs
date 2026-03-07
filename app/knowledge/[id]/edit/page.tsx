import { redirect } from 'next/navigation';
import ArticleComposer from '@/components/ArticleComposer';
import { getAuthFromCookies } from '@/lib/auth';

async function getArticle(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/articles/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function KnowledgeEditPage({ params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') redirect('/login');

  const article = await getArticle(params.id);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">编辑知识文章</h2>
      <ArticleComposer mode="edit" articleId={article.id} initialTitle={article.title} initialCategory={article.category} initialContent={article.content} />
    </div>
  );
}
