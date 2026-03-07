async function getAnimals() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/animals`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalsPage() {
  const animals = await getAnimals();
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">动物图鉴</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {animals.map((a: any) => (
          <a key={a.id} href={`/animals/${a.id}`} className="rounded-xl border bg-white p-4 shadow-sm hover:shadow">
            <p className="font-semibold">{a.name}</p>
            <p className="text-sm text-slate-500">{a.species} · {a.location}</p>
            <p className="text-sm">{a.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
