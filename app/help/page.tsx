import HelpRequestComposer from '@/components/HelpRequestComposer';
import HelpStatusControl from '@/components/HelpStatusControl';
import { getAuthFromCookies } from '@/lib/auth';

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/help-requests`, { cache: 'no-store' });
  return res.json();
}

export default async function HelpPage() {
  const data = await getData();
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">求助信息</h2>
      <HelpRequestComposer />
      <div className="space-y-3">
        {data.map((r: any) => (
          <div key={r.id} className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
            <p className="font-semibold text-slate-900">{r.title}</p>
            <p className="text-sm text-amber-700">{r.type} · {r.location} · {r.status}</p>
            <p className="mt-1 text-sm text-slate-700">{r.description}</p>
            <p className="mt-1 text-sm text-slate-600">联系方式：{r.contact_info}</p>
            {auth && (isAdmin || auth.userId === r.author_id) ? (
              <HelpStatusControl id={r.id} current={r.status} isAdmin={Boolean(isAdmin)} urgentLevel={r.urgent_level || 0} pinned={Boolean(r.is_pinned)} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
