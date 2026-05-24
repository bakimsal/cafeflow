'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Tag } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; sortOrder: number; isActive: boolean }) => void;
  editingCategory?: Category | null;
  isLoading?: boolean;
}

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isLoading = false,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSortOrder(editingCategory.sortOrder);
      setIsActive(editingCategory.isActive);
    } else {
      setName('');
      setSortOrder(0);
      setIsActive(true);
    }
    setError('');
  }, [editingCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Kategori adı zorunludur.');
      return;
    }
    onSubmit({ name: name.trim(), sortOrder, isActive });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-2xl p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <Tag className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h2>
            <p className="text-xs text-white/40">
              {editingCategory ? 'Kategori bilgilerini güncelleyin' : 'Menüye yeni kategori ekleyin'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Kategori Adı <span className="text-brand-400">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Örn: Sıcak İçecekler"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/[0.08] transition-all"
            />
            {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Sıralama
            </label>
            <input
              id="category-sort-order"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/[0.08] transition-all"
            />
            <p className="mt-1 text-xs text-white/30">Küçük sayı önce gösterilir</p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/[0.08]">
            <div>
              <p className="text-sm font-medium text-white/80">Aktif</p>
              <p className="text-xs text-white/35 mt-0.5">Pasif kategoriler menüde görünmez</p>
            </div>
            <button
              type="button"
              id="category-active-toggle"
              onClick={() => setIsActive(!isActive)}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                isActive ? 'bg-brand-500' : 'bg-white/15'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              id="category-form-submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingCategory ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
