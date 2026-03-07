async function getAnimals() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/animals`, { cache: 'no-store' });
  return res.json();
}

export default async function AdoptionPage() {
  const animals = await getAnimals();
  const adoptables = animals.filter((a: any) => a.adoption_status !== 'adopted');
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Adoption</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {adoptables.map((a: any) => (
          <div key={a.id} className="rounded border bg-white p-4">
            <p className="font-semibold">{a.name}</p>
            <p className="text-sm text-slate-500">{a.adoption_status}</p>
            <p>{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
