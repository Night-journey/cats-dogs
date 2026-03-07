export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="mb-3 text-lg font-semibold text-amber-900">{title}</h3>
      <div className="text-slate-700">{children}</div>
    </section>
  );
}
