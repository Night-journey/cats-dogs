import AdoptionPostComposer from '@/components/AdoptionPostComposer';
import AdoptionPostStatusControl from '@/components/AdoptionPostStatusControl';
import AdminDeleteButton from '@/components/AdminDeleteButton';
import DeleteButton from '@/components/DeleteButton';
import { getAuthFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';

function normalizeStatus(status?: string) {
  const map: Record<string, string> = {
    'pending': '待审核',
    'approved': '已通过',
    'rejected': '已拒绝'
  };
  return map[status || ''] || status;
}

function normalizeSpecies(species?: string) {
  if (species === 'cat') return '猫咪';
  if (species === 'dog') return '狗狗';
  return species || '';
}

export default async function AdoptionPage() {
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const userId = auth?.userId;
  
  let adoptionPosts;
  if (isAdmin) {
    adoptionPosts = await query('SELECT * FROM adoption_posts ORDER BY created_at DESC');
  } else {
    // 显示已通过的 + 自己发布的待审核/已拒绝
    if (userId) {
      adoptionPosts = await query(
        "SELECT * FROM adoption_posts WHERE status='approved' OR author_id=$1 ORDER BY created_at DESC",
        [userId]
      );
    } else {
      adoptionPosts = await query("SELECT * FROM adoption_posts WHERE status='approved' ORDER BY created_at DESC");
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-100 via-amber-100 to-orange-100 p-5">
        <h2 className="text-2xl font-bold text-emerald-900">领养专区</h2>
        <p className="mt-1 text-sm text-emerald-800">浏览真实送养信息，找到愿意守护它一生的人</p>
      </div>

      <AdoptionPostComposer />

      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {adoptionPosts.rows.map((item: any) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              {item.image_urls?.[0] ? (
                <img src={item.image_urls[0]} alt={`${item.title} 封面`} className="aspect-[3/4] w-full object-cover" />
              ) : (
                <div className="aspect-[3/4] w-full bg-gradient-to-br from-emerald-100 to-amber-100" />
              )}

              <div className="space-y-2 p-4">
                <h4 className="line-clamp-2 font-semibold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.animal_name} · {normalizeSpecies(item.species)}</p>
                <p className="line-clamp-3 text-sm text-slate-700">{item.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <span className={`rounded-full px-2 py-1 font-medium ${
                    item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>{normalizeStatus(item.status)}</span>
                  {item.contact_info ? <span className="text-slate-500">联系：{item.contact_info}</span> : null}
                </div>

                {item.image_urls?.length > 1 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {item.image_urls.slice(1, 4).map((url: string, idx: number) => (
                      <img key={`${item.id}-${idx}`} src={url} alt={`${item.title} 图片${idx + 2}`} className="aspect-square w-full rounded-lg object-cover" />
                    ))}
                  </div>
                ) : null}

                {(isAdmin || userId === item.author_id) ? (
                  <div className="flex gap-2">
                    {isAdmin && <AdoptionPostStatusControl id={item.id} current={item.status} />}
                    <DeleteButton endpoint={`/api/adoption-posts/${item.id}`} label="删除" />
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
