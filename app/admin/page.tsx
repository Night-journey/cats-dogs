import Card from '@/components/Card';

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">管理后台</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="动物管理">对动物档案与领养状态进行增删改查。</Card>
        <Card title="论坛审核">审核并删除不当帖子或评论。</Card>
        <Card title="求助信息">更新求助状态并优先处理紧急需求。</Card>
        <Card title="领养申请">审核/驳回申请并进行后续联系。</Card>
        <Card title="知识文章">创建或编辑救助指南与应急信息。</Card>
        <Card title="用户管理">管理用户账号与角色权限。</Card>
      </div>
    </div>
  );
}
