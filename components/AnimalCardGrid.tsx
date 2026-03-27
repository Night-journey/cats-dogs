'use client';

import Link from 'next/link';
import Image from 'next/image';

type AnimalItem = {
  id: number;
  avatar_url?: string;
  name: string;
  species: string;
  location?: string;
  description?: string;
  personality_tags?: string[];
  adoption_status?: string;
};

function normalizeSpecies(species?: string) {
  if (species === 'dog') return '狗狗';
  if (species === 'cat') return '猫咪';
  return species || '未知';
}

function normalizeStatus(status?: string) {
  if (!status) return '未知';
  const statusMap: Record<string, string> = {
    'campus_resident': '在校活跃',
    'adopted': '被领养',
    'medical': '就医中',
    'deceased': '在喵星'
  };
  return statusMap[status] || status;
}

export default function AnimalCardGrid({ animals }: { animals: AnimalItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {animals.map((a) => (
        <Link
          key={a.id}
          href={`/animals/${a.id}`}
          className="group block overflow-hidden rounded-2xl bg-white text-left transition hover:-translate-y-1 hover:shadow-xl"
        >
          {a.avatar_url ? (
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl">
              <Image
                src={a.avatar_url}
                alt={a.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="block aspect-[3/4] w-full rounded-t-2xl bg-gradient-to-br from-amber-100 to-orange-100" />
          )}
          <div className="p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-slate-900">{a.name}</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {normalizeStatus(a.adoption_status)}
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-700">🐾 {normalizeSpecies(a.species)} · 📍 {a.location || '未知地点'}</p>
            {a.personality_tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {a.personality_tags.slice(0, 2).map((tag) => (
                  <span key={`${a.id}-${tag}`} className="rounded-full bg-orange-50 px-1.5 py-0.5 text-xs text-orange-600">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
