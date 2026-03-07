import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">共建友善校园，守护流浪猫狗</h2>
      <p className="text-slate-600">浏览动物档案、参与社区讨论、发布求助信息、提交领养申请。</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="动物图鉴">支持查询、筛选和查看校园猫狗档案。</Card>
        <Card title="校园论坛">分享救助故事、图片动态并互动评论。</Card>
        <Card title="救助与领养">发布紧急求助，跟进领养流程。</Card>
      </div>
    </div>
  );
}
