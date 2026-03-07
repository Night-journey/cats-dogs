import AdoptionRequestForm from '@/components/AdoptionRequestForm';
import AdoptionStatusControl from '@/components/AdoptionStatusControl';
import { getAuthFromCookies } from '@/lib/auth';

async function getAnimals(searchParams?: { q?: string; species?: string }) {
  const params = new URLSearchParams();
  if (searchParams?.q) params.set('q', searchParams.q);
  if (searchParams?.species) params.set('species', searchParams.species);
  const query = params.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/animals${query ? `?${query}` : ''}`, { cache: 'no-store' });
  return res.json();
}

async function getAdoptionRequests() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/adoption-requests`, { cache: 'no-store' });
  return res.json();
}

export default async function AdoptionPage({ searchParams }: { searchParams?: { animalId?: string } }) {
  const animals = await getAnimals();
  const adoptables = animals.filter((a: any) => a.adoption_status !== 'adopted');
  const auth = getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const requests = isAdmin ? await getAdoptionRequests() : [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">领养专区</h2>
      <AdoptionRequestForm animals={animals} defaultAnimalId={Number(searchParams?.animalId) || undefined} />

      {isAdmin ? (
        <section className="space-y-3 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
          <h3 className="font-semibold text-amber-900">管理员：领养申请审核</h3>
          {requests.map((item: any) => (
            <div key={item.id} className="rounded-xl border border-amber-100 p-3">
              <p className="font-medium text-slate-900">{item.animal_name || `动物#${item.animal_id}`} · {item.applicant_name}</p>
              <p className="text-sm text-slate-600">联系方式：{item.contact}</p>
              <p className="text-sm text-slate-700">说明：{item.message}</p>
              <AdoptionStatusControl id={item.id} current={item.status} />
            </div>
          ))}
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {adoptables.map((a: any) => (
          <div key={a.id} className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
            <p className="font-semibold text-slate-900">{a.name}</p>
            <p className="text-sm text-amber-700">状态：{a.adoption_status}</p>
            <p className="mt-1 text-sm text-slate-700">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
