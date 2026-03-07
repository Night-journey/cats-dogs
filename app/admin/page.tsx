import Card from '@/components/Card';

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Animals Management">CRUD for animal profiles and adoption status.</Card>
        <Card title="Forum Moderation">Review and delete inappropriate posts/comments.</Card>
        <Card title="Help Requests">Update request status and prioritize urgent needs.</Card>
        <Card title="Adoption Applications">Approve/reject applications and follow-up contacts.</Card>
        <Card title="Knowledge Articles">Create/edit rescue guides and emergency info.</Card>
        <Card title="User Management">Manage users and role permissions.</Card>
      </div>
    </div>
  );
}
