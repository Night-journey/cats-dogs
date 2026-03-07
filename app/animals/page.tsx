import Link from 'next/link';

async function getAnimals(searchParams?: { q?: string; species?: string }) {
  const params = new URLSearchParams();
  if (searchParams?.q) params.set('q', searchParams.q);
  if (searchParams?.species) params.set('species', searchParams.species);
  const query = params.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals${query ? `?${query}` : ''}`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalsPage({ searchParams }: { searchParams?: { q?: string; species?: string } }) {
  const animals = await getAnimals(searchParams);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">动物图鉴</h2>

      <form className="grid gap-3 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm md:grid-cols-4" method="GET">
        <input name="q" defaultValue={searchParams?.q || ''} className="rounded-xl border border-amber-200 px-3 py-2 md:col-span-2" placeholder="搜索名称或描述" />
        <select name="species" defaultValue={searchParams?.species || ''} className="rounded-xl border border-amber-200 px-3 py-2">
          <option value="">全部物种</option>
          <option value="cat">猫</option>
          <option value="dog">狗</option>
        </select>
        <div className="flex gap-2">
          <button className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white">筛选</button>
          <Link href="/animals" className="rounded-xl border border-amber-200 px-4 py-2 text-sm text-slate-700">重置</Link>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {animals.map((a: any) => (
          <a key={a.id} href={`/animals/${a.id}`} className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="font-semibold text-slate-900">{a.name}</p>
            <p className="text-sm text-amber-700">{a.species} · {a.location}</p>
            <p className="mt-1 text-sm text-slate-700">{a.description}</p>
            <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">查看详情 / 提交领养申请</p>
          </a>
        ))}
      </div>
    </div>
  );
}
