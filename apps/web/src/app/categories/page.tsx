'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import CategoryTable from '@/components/categories/category-table';
import CategoryForm from '@/components/categories/category-form';
import type { Category } from '@/types';
import { Plus, Search, Tag, LayoutGrid, Trash2 } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    businessId: 'biz-1',
    name: 'Sıcak İçecekler',
    sortOrder: 1,
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: '2',
    businessId: 'biz-1',
    name: 'Soğuk İçecekler',
    sortOrder: 2,
    isActive: true,
    createdAt: '2025-01-10T08:05:00Z',
    updatedAt: '2025-01-10T08:05:00Z',
  },
  {
    id: '3',
    businessId: 'biz-1',
    name: 'Tatlılar',
    sortOrder: 3,
    isActive: true,
    createdAt: '2025-01-11T09:00:00Z',
    updatedAt: '2025-01-11T09:00:00Z',
  },
  {
    id: '4',
    businessId: 'biz-1',
    name: 'Tostlar',
    sortOrder: 4,
    isActive: false,
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-12T10:00:00Z',
  },
  {
    id: '5',
    businessId: 'biz-1',
    name: 'Atıştırmalıklar',
    sortOrder: 5,
    isActive: true,
    createdAt: '2025-01-13T11:00:00Z',
    updatedAt: '2025-01-13T11:00:00Z',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'passive'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Stats
  const totalCount = categories.length;
  const activeCount = categories.filter(c => c.isActive).length;
  const passiveCount = categories.filter(c => !c.isActive).length;

  // ── Filtered list
  const filtered = categories.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterActive === 'all'
        ? true
        : filterActive === 'active'
        ? cat.isActive
        : !cat.isActive;
    return matchSearch && matchFilter;
  });

  // ── Handlers
  const handleOpenNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: { name: string; sortOrder: number; isActive: boolean }) => {
    setIsSubmitting(true);
    // Simulate API call — replace with real API call later
    setTimeout(() => {
      if (editingCategory) {
        setCategories(prev =>
          prev.map(c =>
            c.id === editingCategory.id
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c
          )
        );
      } else {
        const newCat: Category = {
          id: String(Date.now()),
          businessId: 'biz-1',
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCategories(prev => [...prev, newCat]);
      }
      setIsSubmitting(false);
      setIsFormOpen(false);
      setEditingCategory(null);
    }, 600);
  };

  const handleToggleActive = (id: string, currentState: boolean) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, isActive: !currentState, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    setCategories(prev => prev.filter(c => c.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <AdminLayout title="Kategoriler">
      <div className="space-y-6 animate-fade-in">

        {/* ── Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Kategoriler</h1>
            <p className="text-sm text-white/40 mt-0.5">
              Menü kategorilerini yönetin ve düzenleyin
            </p>
          </div>
          <button
            id="btn-new-category"
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-900/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Kategori Ekle
          </button>
        </div>

        {/* ── Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Toplam Kategori', value: totalCount, icon: LayoutGrid, color: 'brand' },
            { label: 'Aktif', value: activeCount, icon: Tag, color: 'emerald' },
            { label: 'Pasif', value: passiveCount, icon: Tag, color: 'gray' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    color === 'brand'
                      ? 'bg-brand-500/15'
                      : color === 'emerald'
                      ? 'bg-emerald-500/15'
                      : 'bg-white/[0.08]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      color === 'brand'
                        ? 'text-brand-400'
                        : color === 'emerald'
                        ? 'text-emerald-400'
                        : 'text-white/30'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/40">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Filter */}
        <div className="glass rounded-2xl p-1.5 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2.5 px-3">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              id="category-search"
              type="text"
              placeholder="Kategori ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none py-2"
            />
          </div>
          <div className="flex items-center gap-1 pr-1">
            {(['all', 'active', 'passive'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterActive(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filterActive === f
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Pasif'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <p className="text-sm text-white/50">
              <span className="text-white font-semibold">{filtered.length}</span> kategori listeleniyor
            </p>
          </div>
          <CategoryTable
            categories={filtered}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      {/* ── Category Form Modal */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingCategory(null); }}
        onSubmit={handleFormSubmit}
        editingCategory={editingCategory}
        isLoading={isSubmitting}
      />

      {/* ── Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative glass rounded-2xl p-6 w-full max-w-sm animate-slide-up text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Kategoriyi Sil</h3>
            <p className="text-sm text-white/45 mb-6">
              Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
              >
                İptal
              </button>
              <button
                id="btn-confirm-delete-category"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-all"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
