import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-sm">
        <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">欢迎来到校园救助站</p>
        <h2 className="text-3xl font-bold text-amber-900">一起守护校园流浪猫狗</h2>
        <p className="mt-2 text-slate-600">浏览动物档案、参与社区讨论、发布求助信息，并提交领养申请。</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="动物图鉴">支持搜索与筛选，查看校园内猫狗的详细信息。</Card>
        <Card title="社区论坛">像社交动态一样分享故事、图片与评论。</Card>
        <Card title="救助与领养">发布紧急求助并跟进领养流程。</Card>
      </div>
    </div>
  );
}
