import Link from 'next/link';
import { query } from '@/lib/db';
import Carousel from '@/components/Carousel';
import StatsBar from '@/components/StatsBar';

async function getStats() {
  try {
    const animalCount = await query<{ count: string }>('SELECT COUNT(*) as count FROM animals');
    const adoptionCount = await query<{ count: string }>("SELECT COUNT(*) as count FROM animals WHERE adoption_status = 'adopted'");
    const helpCount = await query<{ count: string }>("SELECT COUNT(*) as count FROM help_requests WHERE status = 'resolved'");
    
    return {
      animalCount: parseInt(animalCount.rows[0]?.count || '0'),
      adoptionCount: parseInt(adoptionCount.rows[0]?.count || '0'),
      helpCount: parseInt(helpCount.rows[0]?.count || '0'),
    };
  } catch {
    return { animalCount: 128, adoptionCount: 45, helpCount: 23 };
  }
}

async function getCarouselAnimals() {
  try {
    // 随机获取最多4只有头像的动物
    const result = await query<{ id: number; name: string; avatar_url: string }>(
      "SELECT id, name, avatar_url FROM animals WHERE avatar_url IS NOT NULL AND avatar_url != '' ORDER BY RANDOM() LIMIT 4"
    );
    return result.rows.map((animal) => ({
      id: animal.id,
      name: animal.name,
      image: animal.avatar_url,
      link: `/animals/${animal.id}`,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [stats, carouselAnimals] = await Promise.all([getStats(), getCarouselAnimals()]);

  return (
    <div className="space-y-8">
      {/* Hero 轮播图 */}
      <Carousel slides={carouselAnimals} />

      {/* 统计卡片 */}
      <StatsBar stats={stats} />

      {/* 欢迎标语 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-8 text-center">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-amber-900">🐾 一起守护西财的猫猫狗狗</h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            浏览动物档案、参与社区讨论、发布求助信息，并提交领养申请。每一只流浪的小生命都值得被温柔以待。
          </p>
          <div className="mt-5 flex justify-center gap-4">
            <Link
              href="/animals"
              className="rounded-full bg-amber-500 px-6 py-2.5 font-medium text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              浏览图鉴
            </Link>
            <Link
              href="/adoption"
              className="rounded-full bg-white border-2 border-amber-200 px-6 py-2.5 font-medium text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all hover:-translate-y-0.5"
            >
              申请领养
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 text-[120px] opacity-5 select-none">🐱</div>
        <div className="absolute bottom-0 left-0 text-[100px] opacity-5 select-none">🐕</div>
      </section>

      {/* 功能卡片 */}
      <div className="grid gap-5 md:grid-cols-3">
        <Link href="/animals" className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-700 transition">猫狗图鉴</h3>
            <p className="mt-2 text-sm text-slate-500">支持搜索与筛选，查看校园内猫狗的详细信息</p>
          </div>
        </Link>

        <Link href="/forum" className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition">社区论坛</h3>
            <p className="mt-2 text-sm text-slate-500">像社交动态一样分享故事、图片与评论</p>
          </div>
        </Link>

        <Link href="/help" className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="text-4xl mb-3">🆘</div>
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-rose-700 transition">救助领养</h3>
            <p className="mt-2 text-sm text-slate-500">发布紧急求助并跟进领养流程</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
