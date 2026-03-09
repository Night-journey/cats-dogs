'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnimalFiltersForm({ q }: { q?: string; species?: string }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(q || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchValue.trim()) {
      params.set('q', searchValue.trim());
    }
    router.push(`/animals${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input 
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full rounded-xl border border-amber-200 px-4 py-3 pr-12 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="搜索动物名称..." 
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-amber-500 hover:text-amber-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
