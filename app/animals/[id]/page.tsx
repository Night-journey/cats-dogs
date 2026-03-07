import Link from 'next/link';
import AnimalNoteComposer from '@/components/AnimalNoteComposer';
import AnimalCorrectionComposer from '@/components/AnimalCorrectionComposer';

async function getAnimal(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}`, { cache: 'no-store' });
  return res.json();
}

async function getAnimalNotes(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}/notes`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalDetail({ params }: { params: { id: string } }) {
  const animal = await getAnimal(params.id);
  const notes = await getAnimalNotes(params.id);
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

      <section className="space-y-2 pt-3">
        <h3 className="font-semibold text-amber-900">观察笔记（审核后展示）</h3>
        <AnimalNoteComposer animalId={animal.id} />
        <div className="space-y-2">
          {notes.map((n: any) => (
            <div key={n.id} className="rounded border border-amber-100 p-2 text-sm">
              <p className="font-medium text-slate-800">{n.author || '匿名用户'}</p>
              <p className="text-slate-700">{n.content}</p>
            </div>
          ))}
        </div>
      </section>

      <AnimalCorrectionComposer animalId={animal.id} />
    </div>
  );
}
