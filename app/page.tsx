import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">一起守护校园流浪猫狗</h2>
      <p className="text-slate-600">浏览动物档案、参与社区讨论、发布求助信息，并提交领养申请。</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="动物图鉴">支持搜索与筛选，查看校园内猫狗的详细信息。</Card>
        <Card title="社区论坛">像社交动态一样分享故事、图片与评论。</Card>
        <Card title="救助与领养">发布紧急求助并跟进领养流程。</Card>
      </div>
    </div>
  );
}
