import HelpRequestComposer from '@/components/HelpRequestComposer';
import HelpStatusControl from '@/components/HelpStatusControl';
import AdminDeleteButton from '@/components/AdminDeleteButton';
import { getAuthFromCookies } from '@/lib/auth';

function normalizeStatus(status?: string) {
  const map: Record<string, string> = {
    'open': '待响应',
    'processing': '处理中',
    'closed': '已解决'
  };
  return map[status || ''] || status;
}

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/help-requests`, { cache: 'no-store' });
  return res.json();
}

export default async function HelpPage() {
  const data = await getData();
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';

  const sortedData = [...data].sort((a, b) => {
    if (b.is_pinned !== a.is_pinned) return b.is_pinned ? 1 : -1;
    return (b.urgent_level || 0) - (a.urgent_level || 0);
  });

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 p-6 text-white">
        <div className="absolute -right-4 -top-4 text-9xl opacity-10">🆘</div>
        <h2 className="relative text-2xl font-bold">爱心求助</h2>
        <p className="relative mt-1 text-sm text-white/80">发布猫狗求助信息，携手救助小生命</p>
      </div>

      <HelpRequestComposer />

      <section>
        {sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-5xl">🤝</div>
            <p className="text-slate-600">暂无求助信息</p>
            <p className="text-sm text-slate-500">快来发布第一条求助信息吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedData.map((r: any) => (
              <div
                key={r.id}
                className="group rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {r.urgent_level > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${r.urgent_level >= 2 ? 'bg-rose-600' : 'bg-orange-500'}`}>
                          {r.urgent_level >= 2 ? '非常紧急' : '紧急'}
                        </span>
                      )}
                      {r.is_pinned && (
                        <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">置顶</span>
                      )}
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{r.type}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 group-hover:text-amber-600">{r.title}</h4>
                    <p className="line-clamp-2 text-sm text-slate-600">{r.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>地点：{r.location || '未知地点'}</span>
                      <span>联系方式：{r.contact_info}</span>
                    </div>
                    {auth && (isAdmin || auth.userId === r.author_id) ? (
                      <div className="flex items-center gap-2 pt-2">
                        <HelpStatusControl id={r.id} current={r.status} isAdmin={Boolean(isAdmin)} urgentLevel={r.urgent_level || 0} pinned={Boolean(r.is_pinned)} />
                        <AdminDeleteButton endpoint={`/api/help-requests/${r.id}`} label="删除" />
                      </div>
                    ) : null}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${r.status === 'closed' ? 'bg-slate-100 text-slate-400' : r.status === 'processing' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {normalizeStatus(r.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
