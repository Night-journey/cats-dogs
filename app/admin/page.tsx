import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';

const adminActions = [
  { title: '动物管理', desc: '维护动物档案与领养状态', href: '/animals', emoji: '🐾' },
  { title: '论坛审核', desc: '管理帖子与评论内容', href: '/forum', emoji: '💬' },
  { title: '求助处理', desc: '跟进紧急求助与处理进展', href: '/help', emoji: '🆘' },
  { title: '领养申请审核', desc: '处理申请并推进领养流程', href: '/adoption', emoji: '🏠' },
  { title: '知识文章管理', desc: '发布与维护救助知识', href: '/knowledge', emoji: '📚' }
];

export default async function AdminPage() {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') redirect('/login');

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-5 shadow-sm sm:p-7">
        <p className="mb-2 text-sm text-amber-700">管理员模式已开启</p>
        <h2 className="text-2xl font-bold text-amber-900 sm:text-3xl">管理员操作面板</h2>
        <p className="mt-2 text-sm text-slate-700">请选择要处理的模块。页面采用温暖配色，兼容手机与电脑端。</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminActions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
          >
            <p className="text-2xl">{item.emoji}</p>
            <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
            <p className="mt-4 text-sm font-medium text-amber-700 group-hover:text-amber-800">进入模块 →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
