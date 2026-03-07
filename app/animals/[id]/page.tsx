async function getAnimal(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/animals/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalDetail({ params }: { params: { id: string } }) {
  const animal = await getAnimal(params.id);
  return (
    <div className="space-y-3 rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-bold">{animal.name}</h2>
      <p>{animal.species} · {animal.gender} · {animal.age}</p>
      <p>Color: {animal.coat_color} | Neutered: {animal.neutered ? 'Yes' : 'No'}</p>
      <p>Location: {animal.location} | Active: {animal.active_time}</p>
      <p>Status: {animal.adoption_status}</p>
      <p>{animal.description}</p>
    </div>
  );
}
