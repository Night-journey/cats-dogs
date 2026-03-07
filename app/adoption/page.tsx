import AdoptionRequestForm from '@/components/AdoptionRequestForm';
import AdoptionStatusControl from '@/components/AdoptionStatusControl';
import AdoptionPostComposer from '@/components/AdoptionPostComposer';
import BlacklistFeedbackComposer from '@/components/BlacklistFeedbackComposer';
import { getAuthFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';

async function getAnimals(searchParams?: { q?: string; species?: string }) {
  const params = new URLSearchParams();
  if (searchParams?.q) params.set('q', searchParams.q);
  if (searchParams?.species) params.set('species', searchParams.species);
  const query = params.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals${query ? `?${query}` : ''}`, { cache: 'no-store' });
  return res.json();
}

async function getAdoptionRequests(isAdmin: boolean, userId?: number) {
  if (isAdmin) {
    const result = await query(
      `SELECT ar.*, a.name animal_name FROM adoption_requests ar
       LEFT JOIN animals a ON ar.animal_id=a.id
       ORDER BY ar.created_at DESC`
    );
    return result.rows;
  }

  if (!userId) return [];
  const result = await query(
    `SELECT ar.*, a.name animal_name FROM adoption_requests ar
     LEFT JOIN animals a ON ar.animal_id=a.id
     WHERE ar.applicant_id=$1
     ORDER BY ar.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export default async function AdoptionPage({ searchParams }: { searchParams?: { animalId?: string } }) {
  const animals = await getAnimals();
  const adoptables = animals.filter((a: any) => a.adoption_status !== 'adopted');
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const requests = await getAdoptionRequests(isAdmin, auth?.userId);
  const adoptionPosts = isAdmin
    ? await query('SELECT * FROM adoption_posts ORDER BY created_at DESC')
    : await query("SELECT * FROM adoption_posts WHERE status='approved' ORDER BY created_at DESC");
  const blacklistFeedback = isAdmin ? await query('SELECT * FROM adoption_blacklist_feedback ORDER BY created_at DESC') : { rows: [] as any[] };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">领养专区</h2>
      <AdoptionRequestForm animals={animals} defaultAnimalId={Number(searchParams?.animalId) || undefined} />
      <AdoptionPostComposer />
      <BlacklistFeedbackComposer />

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
      ) : auth ? (
        <section className="space-y-3 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
          <h3 className="font-semibold text-amber-900">我的领养申请</h3>
          {requests.length ? (
            requests.map((item: any) => (
              <div key={item.id} className="rounded-xl border border-amber-100 p-3">
                <p className="font-medium text-slate-900">{item.animal_name || `动物#${item.animal_id}`}</p>
                <p className="text-sm text-slate-600">联系方式：{item.contact}</p>
                <p className="text-sm text-slate-700">申请说明：{item.message}</p>
                <p className="mt-1 text-sm text-amber-700">当前状态：{item.status}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">你还没有提交过领养申请。</p>
          )}
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

      <section className="space-y-3 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
        <h3 className="font-semibold text-amber-900">送养信息列表</h3>
        {adoptionPosts.rows.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-amber-100 p-3">
            <p className="font-medium text-slate-900">{item.title} · {item.animal_name}</p>
            <p className="text-sm text-slate-600">{item.species} · 状态：{item.status}</p>
            <p className="text-sm text-slate-700">{item.description}</p>
          </div>
        ))}
      </section>

      {isAdmin ? (
        <section className="space-y-3 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
          <h3 className="font-semibold text-amber-900">管理员：不良领养人反馈</h3>
          {blacklistFeedback.rows.map((item: any) => (
            <div key={item.id} className="rounded-xl border border-amber-100 p-3">
              <p className="font-medium text-slate-900">{item.suspect_name} · {item.status}</p>
              <p className="text-sm text-slate-700">原因：{item.reason}</p>
              <p className="text-sm text-slate-600">证据：{item.evidence || '无'}</p>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}
