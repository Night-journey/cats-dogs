async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles`, { cache: 'no-store' });
  return res.json();
}

export default async function KnowledgePage() {
  const articles = await getArticles();
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Rescue Knowledge</h2>
      <div className="space-y-3">
        {articles.map((a: any) => (
          <a key={a.id} href={`/knowledge/${a.id}`} className="block rounded border bg-white p-4">
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-slate-500">{a.category}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
