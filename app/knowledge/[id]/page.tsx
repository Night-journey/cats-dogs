async function getArticle(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function ArticleDetail({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  return (
    <article className="rounded border bg-white p-6">
      <h2 className="text-2xl font-bold">{article.title}</h2>
      <p className="mb-3 text-sm text-slate-500">{article.category}</p>
      <p className="whitespace-pre-wrap">{article.content}</p>
    </article>
  );
}
