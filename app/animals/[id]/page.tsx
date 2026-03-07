import Link from 'next/link';
import AnimalNoteComposer from '@/components/AnimalNoteComposer';
import AnimalCorrectionComposer from '@/components/AnimalCorrectionComposer';
import ModerationControl from '@/components/ModerationControl';
import { getAuthFromCookies } from '@/lib/auth';

async function getAnimal(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}`, { cache: 'no-store' });
  return res.json();
}

async function getAnimalNotes(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}/notes`, { cache: 'no-store' });
  return res.json();
}

async function getAnimalCorrections(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}/corrections`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalDetail({ params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const [animal, notes, corrections] = await Promise.all([
    getAnimal(params.id),
    getAnimalNotes(params.id),
    getAnimalCorrections(params.id)
  ]);

  return (
    <div className="space-y-3 rounded-xl border bg-white p-6">
      {animal.avatar_url ? <img src={animal.avatar_url} alt={animal.name} className="h-56 w-full rounded-xl object-cover" /> : null}
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
              <p className="font-medium text-slate-800">{n.author || '匿名用户'} {isAdmin ? `· ${n.status}` : ''}</p>
              <p className="text-slate-700">{n.content}</p>
              {isAdmin ? <ModerationControl id={n.id} current={n.status} updateEndpoint={`/api/animal-notes/${n.id}`} deleteEndpoint={`/api/animal-notes/${n.id}`} /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 pt-3">
        <h3 className="font-semibold text-amber-900">资料纠错建议</h3>
        <AnimalCorrectionComposer animalId={animal.id} />
        <div className="space-y-2">
          {corrections.map((item: any) => (
            <div key={item.id} className="rounded border border-amber-100 p-2 text-sm">
              <p className="font-medium text-slate-800">{item.proposer || '匿名用户'} 提议修正 {item.field_name} {isAdmin ? `· ${item.status}` : ''}</p>
              <p className="text-slate-700">建议值：{item.suggested_value || '（空）'}</p>
              <p className="text-slate-600">原因：{item.reason || '（无）'}</p>
              {isAdmin ? <ModerationControl id={item.id} current={item.status} updateEndpoint={`/api/animal-corrections/${item.id}`} deleteEndpoint={`/api/animal-corrections/${item.id}`} /> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
