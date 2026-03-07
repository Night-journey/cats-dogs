import { redirect } from 'next/navigation';
import ArticleComposer from '@/components/ArticleComposer';
import { getAuthFromCookies } from '@/lib/auth';

export default async function KnowledgeNewPage() {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') redirect('/login');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">新增知识文章</h2>
      <ArticleComposer mode="create" />
    </div>
  );
}
