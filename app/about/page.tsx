export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 p-6 text-white">
        <div className="absolute -right-4 -top-4 text-9xl opacity-10">❤️</div>
        <h2 className="relative text-2xl font-bold">关于我们</h2>
        <p className="relative mt-2 text-lg">用爱守护每一个生命，让校园充满温暖</p>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-amber-900">我们是谁</h3>
        <p className="mt-2 text-slate-700">
          该网站是由一群热爱猫猫狗狗的学生自发组织的公益团体。我们致力于校园内流浪猫狗的救助、关爱和领养工作。
        </p>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-amber-900">联系我们</h3>
        <p className="mt-2 text-slate-700">邮箱：campus.animals@example.com</p>
      </div>
    </div>
  );
}
