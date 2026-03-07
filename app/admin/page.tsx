import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';

const adminActions = [
  ['动物管理', '/animals'],
  ['论坛管理', '/forum'],
  ['求助管理', '/help'],
  ['领养管理', '/adoption'],
  ['知识文章管理', '/knowledge']
];

export default function AdminPage() {
  const auth = getAuthFromCookies();
  if (!auth || auth.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-4 rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-bold">管理员操作</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {adminActions.map(([label, href]) => (
          <Link key={href} href={href} className="rounded border px-4 py-3 text-sm hover:bg-slate-50">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
