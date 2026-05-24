'use client';

import { useRef, useEffect } from 'react';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories:      Category[];
  activeId:        string;
  onChange:        (id: string) => void;
  productCountMap: Record<string, number>;
}

export default function CategoryTabs({
  categories,
  activeId,
  onChange,
  productCountMap,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll the active tab into view when it changes
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab       = activeRef.current;
      const offset    = tab.offsetLeft - container.clientWidth / 2 + tab.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto py-1 px-4"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* "Tümü" tab */}
      <button
        ref={activeId === 'all' ? activeRef : undefined}
        onClick={() => onChange('all')}
        className={cn(
          'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
          activeId === 'all'
            ? 'bg-brand-500 text-white shadow-lg shadow-brand-600/40'
            : 'bg-white/[0.08] text-white/55 hover:bg-white/[0.12] hover:text-white/80'
        )}
      >
        Tümü
        <span
          className={cn(
            'text-xs px-1.5 py-0.5 rounded-full font-semibold',
            activeId === 'all' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/45'
          )}
        >
          {Object.values(productCountMap).reduce((a, b) => a + b, 0)}
        </span>
      </button>

      {/* Category tabs */}
      {categories.map(cat => (
        <button
          key={cat.id}
          ref={activeId === cat.id ? activeRef : undefined}
          onClick={() => onChange(cat.id)}
          className={cn(
            'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            activeId === cat.id
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-600/40'
              : 'bg-white/[0.08] text-white/55 hover:bg-white/[0.12] hover:text-white/80'
          )}
        >
          {cat.name}
          {productCountMap[cat.id] !== undefined && (
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                activeId === cat.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/45'
              )}
            >
              {productCountMap[cat.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
