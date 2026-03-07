async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/help-requests`, { cache: 'no-store' });
  return res.json();
}

export default async function HelpPage() {
  const data = await getData();
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">求助中心</h2>
      <div className="space-y-3">
        {data.map((r: any) => (
          <div key={r.id} className="rounded border bg-white p-4">
            <p className="font-semibold">{r.title}</p>
            <p className="text-sm text-slate-500">{r.type} · {r.location} · {r.status}</p>
            <p>{r.description}</p>
            <p className="text-sm">联系方式：{r.contact_info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
