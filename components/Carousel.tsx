'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
  id: number;
  name: string;
  image: string;
  link: string;
}

const defaultSlides: Slide[] = [
  { id: 0, name: '欢迎来到西财猫猫狗狗', image: '', link: '/animals' },
];

export default function Carousel({ slides = defaultSlides }: { slides?: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const displaySlides = slides && slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displaySlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  // 没有动态数据时显示默认欢迎图
  if (!slides || slides.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl shadow-xl aspect-video md:aspect-[21/9] bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-3xl font-bold text-amber-900">欢迎来到西财猫猫狗狗</h3>
          <p className="mt-2 text-amber-800">还没有收录动物，快去添加吧！</p>
          <Link 
            href="/animals" 
            className="mt-4 inline-block rounded-full bg-amber-500 px-6 py-2.5 font-medium text-white hover:bg-amber-600 transition"
          >
            查看图鉴 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {displaySlides.map((slide) => (
          <div key={slide.id} className="relative w-full flex-shrink-0 aspect-video md:aspect-[21/9]">
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority={current === slide.id}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🐾</div>
                  <h3 className="text-3xl font-bold text-amber-900">{slide.name}</h3>
                </div>
              </div>
            )}
            {slide.image && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg">{slide.name}</h3>
                  <Link 
                    href={slide.link} 
                    className="mt-2 inline-block rounded-full bg-amber-500/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-600 transition"
                  >
                    查看详情 →
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Dots - only show if more than 1 slide */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows - only show if more than 1 slide */}
      {displaySlides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((current - 1 + displaySlides.length) % displaySlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white/80 backdrop-blur-sm hover:bg-white/40 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => setCurrent((current + 1) % displaySlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white/80 backdrop-blur-sm hover:bg-white/40 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
