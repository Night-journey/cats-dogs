import { redirect } from 'next/navigation';
import AnimalEditor from '@/components/AnimalEditor';
import { getAuthFromCookies } from '@/lib/auth';

async function getAnimal(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditAnimalPage({ params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') {
    redirect('/login');
  }

  const animal = await getAnimal(params.id);
  if (!animal) {
    redirect('/animals');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">编辑动物</h2>
      <p className="text-sm text-slate-600">修改动物档案信息</p>
      <AnimalEditor animal={animal} />
    </div>
  );
}
