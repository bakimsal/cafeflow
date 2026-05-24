'use client';

import { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown, Tag } from 'lucide-react';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentState: boolean) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onToggleActive,
}: CategoryTableProps) {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = [...categories].sort((a, b) =>
    sortDir === 'asc' ? a.sortOrder - b.sortOrder : b.sortOrder - a.sortOrder
  );

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Tag className="w-7 h-7 text-white/20" />
        </div>
        <p className="text-white/40 font-medium">Henüz kategori yok</p>
        <p className="text-white/25 text-sm mt-1">Yeni kategori ekleyerek başlayın</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Kategori Adı
            </th>
            <th className="text-left py-3 px-4">
              <button
                onClick={() => setSortDir(s => s === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1 text-white/40 font-medium text-xs uppercase tracking-wider hover:text-white/70 transition-colors"
              >
                Sıra
                {sortDir === 'asc' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Durum
            </th>
            <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Oluşturulma
            </th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((cat, idx) => (
            <tr
              key={cat.id}
              className={cn(
                'group border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]',
                idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
              )}
            >
              {/* Name */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Tag className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <span className="font-medium text-white/85">{cat.name}</span>
                </div>
              </td>

              {/* Sort Order */}
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 text-white/50 text-xs font-semibold">
                  {cat.sortOrder}
                </span>
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <button
                  onClick={() => onToggleActive(cat.id, cat.isActive)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all',
                    cat.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-white/5 text-white/35 hover:bg-white/10'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      cat.isActive ? 'bg-emerald-400 animate-pulse-dot' : 'bg-white/25'
                    )}
                  />
                  {cat.isActive ? 'Aktif' : 'Pasif'}
                </button>
              </td>

              {/* Created At */}
              <td className="py-3.5 px-4 text-white/35 text-xs">
                {new Date(cat.createdAt).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(cat)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                    title="Düzenle"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
