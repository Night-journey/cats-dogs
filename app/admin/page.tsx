import { getAuthFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminConsole from '@/components/AdminConsole';

export default function AdminPage() {
  const auth = getAuthFromCookies();

  if (!auth) {
    redirect('/login');
  }

  if (auth.role !== 'admin') {
    return <p className="rounded border bg-white p-4 text-sm text-red-600">仅管理员可访问该页面。</p>;
  }

  return <AdminConsole />;
}
