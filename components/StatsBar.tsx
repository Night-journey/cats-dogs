'use client';

import { useEffect, useState } from 'react';

interface Stats {
  animalCount: number;
  adoptionCount: number;
  helpCount: number;
}

export default function StatsBar({ stats }: { stats: Stats }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const items = [
    { label: '收录猫狗', value: stats.animalCount, icon: '🐱', color: 'from-amber-400 to-orange-500' },
    { label: '成功领养', value: stats.adoptionCount, icon: '🏠', color: 'from-emerald-400 to-teal-500' },
    { label: '帮助次数', value: stats.helpCount, icon: '💚', color: 'from-rose-400 to-pink-500' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} p-5 text-white shadow-lg transition-all duration-700 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: `${i * 150}ms` }}
        >
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-3xl font-bold">{visible ? item.value : '—'}</div>
          <div className="text-sm text-white/80 mt-1">{item.label}</div>
          <div className="absolute -right-3 -bottom-3 text-6xl opacity-20">{item.icon}</div>
        </div>
      ))}
    </div>
  );
}
