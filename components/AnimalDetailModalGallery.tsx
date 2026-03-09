'use client';

import { useEffect, useMemo, useState } from 'react';

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

type AnimalDetail = {
  id: number;
  avatar_url?: string;
  name: string;
  alias?: string;
  species: string;
  gender?: string;
  age?: string;
  coat_color?: string;
  neutered?: boolean;
  location?: string;
  active_time?: string;
  adoption_status?: string;
  personality_tags?: string[];
  feeding_guide?: string;
  description?: string;
  anecdotes?: string;
  social_notes?: string;
};

function normalizeSpecies(species?: string) {
  if (species === 'dog') return '狗狗';
  if (species === 'cat') return '猫咪';
  return species || '未知';
}

function normalizeGender(gender?: string) {
  const value = (gender || '').trim();
  if (!value) return '未知';
  if (value.includes('女') || value.includes('母') || value.includes('妹妹')) return '妹妹';
  if (value.includes('男') || value.includes('公') || value.includes('弟弟')) return '弟弟';
  return value;
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

export default function AnimalDetailModalGallery({ animals }: { animals: AnimalItem[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AnimalDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      setError('');
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    fetch(`/api/animals/${selectedId}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || '加载失败');
        return data;
      })
      .then((data) => {
        if (!active) return;
        setDetail(data);
      })
      .catch((e) => {
        if (!active) return;
        setDetail(null);
        setError(e?.message || '加载失败，请稍后重试');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedId]);

  const tags = useMemo(() => detail?.personality_tags || [], [detail?.personality_tags]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {animals.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelectedId(a.id)}
            className="group block overflow-hidden rounded-2xl bg-white text-left transition hover:-translate-y-1 hover:shadow-xl"
          >
            {a.avatar_url ? <img src={a.avatar_url} alt={a.name} className="block aspect-[3/4] w-full rounded-t-2xl object-cover" /> : <div className="block aspect-[3/4] w-full rounded-t-2xl bg-gradient-to-br from-amber-100 to-orange-100" />}
            <div className="p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-slate-900">{a.name}</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{normalizeStatus(a.adoption_status)}</span>
              </div>
              <p className="mt-1 text-xs text-amber-700">🐾 {normalizeSpecies(a.species)} · 📍 {a.location || '未知地点'}</p>
              {a.personality_tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {a.personality_tags.slice(0, 2).map((tag) => (
                    <span key={`${a.id}-${tag}`} className="rounded-full bg-orange-50 px-1.5 py-0.5 text-xs text-orange-600">#{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {selectedId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={() => setSelectedId(null)}>
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
              aria-label="关闭"
            >
              ×
            </button>

            {loading ? <p className="text-sm text-slate-600">加载中…</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            {!loading && !error && detail ? (
              <div className="space-y-4 pr-8">
                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                  {detail.avatar_url ? <img src={detail.avatar_url} alt={detail.name} className="aspect-[3/4] w-full rounded-2xl object-cover" /> : null}

                  <div className="space-y-2 rounded-2xl bg-amber-50/60 p-4">
                    <h3 className="text-2xl font-bold text-slate-900">{detail.name}</h3>
                    <p className="text-sm text-slate-700">别名：{detail.alias || '暂无'}</p>

                    <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                      <p>🐾 类型：{normalizeSpecies(detail.species)}</p>
                      <p>🎨 花色：{detail.coat_color || '未知'}</p>
                      <p>⚧ 性别：{normalizeGender(detail.gender)}</p>
                      <p>🎂 预估年龄：{detail.age || '未知'}</p>
                      <p>💉 绝育状态：{detail.neutered ? '已绝育' : '未绝育/未知'}</p>
                      <p>📍 常驻地点：{detail.location || '未知'}</p>
                      <p>⏰ 活跃时间：{detail.active_time || '未知'}</p>
                      <p>📌 当前状态：{normalizeStatus(detail.adoption_status)}</p>
                    </div>

                    {tags.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span key={`${detail.id}-${tag}`} className="rounded-full bg-white px-2 py-0.5 text-xs text-amber-700">#{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-amber-100 p-3">
                    <p className="font-semibold text-amber-900">🍚 投喂指南</p>
                    <p className="mt-1 text-sm text-slate-700">{detail.feeding_guide || '请优先使用猫粮/犬粮，避免高盐高油食物。'}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 p-3">
                    <p className="font-semibold text-amber-900">📝 介绍</p>
                    <p className="mt-1 text-sm text-slate-700">{detail.description || '暂无介绍'}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 p-3">
                    <p className="font-semibold text-amber-900">🌟 趣闻轶事</p>
                    <p className="mt-1 text-sm text-slate-700">{detail.anecdotes || '暂无记录，欢迎同学补充观察笔记。'}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 p-3">
                    <p className="font-semibold text-amber-900">👥 人际关系</p>
                    <p className="mt-1 text-sm text-slate-700">{detail.social_notes || '暂无记录。'}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setSelectedId(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">关闭</button>
                  <a href={`/animals/${detail.id}`} className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white">打开完整详情页</a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
