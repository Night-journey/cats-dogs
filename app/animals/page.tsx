import Link from 'next/link';
import { getAuthFromCookies } from '@/lib/auth';
import { query } from '@/lib/db';
import AnimalFiltersForm from '@/components/AnimalFiltersForm';
import AnimalCardGrid from '@/components/AnimalCardGrid';

async function getAnimals(searchParams?: { q?: string; species?: string }) {
  const conditions: string[] = [];
  const values: string[] = [];
  if (searchParams?.q) {
    values.push(`%${searchParams.q}%`);
    conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length} OR alias ILIKE $${values.length})`);
  }
  if (searchParams?.species) {
    values.push(searchParams.species);
    conditions.push(`species = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query(`SELECT * FROM animals ${where} ORDER BY created_at DESC`, values);
  return result.rows;
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
