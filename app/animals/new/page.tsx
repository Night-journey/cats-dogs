import { redirect } from 'next/navigation';
import AnimalComposer from '@/components/AnimalComposer';
import { getAuthFromCookies } from '@/lib/auth';

export default async function NewAnimalPage() {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">新增动物</h2>
      <p className="text-sm text-slate-600">仅管理员可创建新动物档案，创建后会在图鉴列表中展示。</p>
      <AnimalComposer />
    </div>
  );
}
