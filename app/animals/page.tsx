import Link from 'next/link';
import { getAuthFromCookies } from '@/lib/auth';
import AnimalFiltersForm from '@/components/AnimalFiltersForm';
import AnimalCardGrid from '@/components/AnimalCardGrid';

async function getAnimals(searchParams?: { q?: string; species?: string }) {
  const params = new URLSearchParams();
  if (searchParams?.q) params.set('q', searchParams.q);
  if (searchParams?.species) params.set('species', searchParams.species);
  const query = params.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals${query ? `?${query}` : ''}`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalsPage({ searchParams }: { searchParams?: { q?: string; species?: string } }) {
  const [animals, auth] = await Promise.all([getAnimals(searchParams), getAuthFromCookies()]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-amber-900">猫狗图鉴</h2>
        {auth?.role === 'admin' ? (
          <Link href="/animals/new" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
            + 增加动物
          </Link>
        ) : null}
      </div>

      <AnimalFiltersForm q={searchParams?.q} species={searchParams?.species} />
      <AnimalCardGrid animals={animals} />
    </div>
  );
}
