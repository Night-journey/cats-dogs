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
      <p>毛色：{animal.coat_color} ｜ 绝育：{animal.neutered ? '是' : '否'}</p>
      <p>常驻地点：{animal.location} ｜ 活跃时间：{animal.active_time}</p>
      <p>领养状态：{animal.adoption_status}</p>
      <p>{animal.description}</p>
    </div>
  );
}
