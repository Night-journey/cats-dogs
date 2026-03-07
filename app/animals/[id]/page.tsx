import Link from 'next/link';

async function getAnimal(id: string) {
  const res = await fetch(`/api/animals/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalDetail({ params }: { params: { id: string } }) {
  const animal = await getAnimal(params.id);
  return (
    <div className="space-y-3 rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-bold">{animal.name}</h2>
      <p>{animal.species} · {animal.gender} · {animal.age}</p>
      <p>毛色：{animal.coat_color} | 绝育：{animal.neutered ? '是' : '否'}</p>
      <p>活动地点：{animal.location} | 活动时间：{animal.active_time}</p>
      <p>领养状态：{animal.adoption_status}</p>
      <p>{animal.description}</p>
      <div className="pt-2">
        <Link href={`/adoption?animalId=${animal.id}`} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          提交领养申请
        </Link>
      </div>
    </div>
  );
}
