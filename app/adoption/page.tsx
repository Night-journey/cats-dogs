import AdoptionPostComposer from '@/components/AdoptionPostComposer';
import AdoptionPostStatusControl from '@/components/AdoptionPostStatusControl';
import { getAuthFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';

export default async function AdoptionPage() {
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const adoptionPosts = isAdmin
    ? await query('SELECT * FROM adoption_posts ORDER BY created_at DESC')
    : await query("SELECT * FROM adoption_posts WHERE status='approved' ORDER BY created_at DESC");

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-100 via-amber-100 to-orange-100 p-5">
        <h2 className="text-2xl font-bold text-emerald-900">领养专区</h2>
        <p className="mt-1 text-sm text-emerald-800">浏览真实送养信息，找到愿意守护它一生的人</p>
      </div>

      <AdoptionPostComposer />

      <section>
        <h3 className="mb-3 text-lg font-semibold text-slate-800">送养信息流</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adoptionPosts.rows.map((item: any) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              {item.image_urls?.[0] ? (
                <img src={item.image_urls[0]} alt={`${item.title} 封面`} className="aspect-[3/4] w-full object-cover" />
              ) : (
                <div className="aspect-[3/4] w-full bg-gradient-to-br from-emerald-100 to-amber-100" />
              )}

              <div className="space-y-2 p-4">
                <h4 className="line-clamp-2 font-semibold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.animal_name} · {item.species}</p>
                <p className="line-clamp-3 text-sm text-slate-700">{item.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">状态：{item.status}</span>
                  {item.contact_info ? <span className="text-slate-500">联系：{item.contact_info}</span> : null}
                </div>

                {item.image_urls?.length > 1 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {item.image_urls.slice(1, 4).map((url: string, idx: number) => (
                      <img key={`${item.id}-${idx}`} src={url} alt={`${item.title} 图片${idx + 2}`} className="aspect-square w-full rounded-lg object-cover" />
                    ))}
                  </div>
                ) : null}

                {isAdmin ? <AdoptionPostStatusControl id={item.id} current={item.status} /> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
