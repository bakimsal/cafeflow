'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import ProductTable from '@/components/products/product-table';
import ProductForm from '@/components/products/product-form';
import type { Product, Category } from '@/types';
import {
  Plus,
  Search,
  ShoppingBag,
  PackageCheck,
  PackageX,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    businessId: 'biz-1',
    name: 'Sıcak İçecekler',
    sortOrder: 1,
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'cat-2',
    businessId: 'biz-1',
    name: 'Soğuk İçecekler',
    sortOrder: 2,
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'cat-3',
    businessId: 'biz-1',
    name: 'Tatlılar',
    sortOrder: 3,
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'cat-4',
    businessId: 'biz-1',
    name: 'Tostlar',
    sortOrder: 4,
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'cat-5',
    businessId: 'biz-1',
    name: 'Atıştırmalıklar',
    sortOrder: 5,
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
];

const mkProduct = (
  id: string,
  catId: string,
  name: string,
  price: number,
  stock: number | null,
  isActive: boolean,
  description?: string
): Product => ({
  id,
  businessId: 'biz-1',
  categoryId: catId,
  name,
  description: description ?? null,
  price,
  imageUrl: null,
  stock,
  isActive,
  createdAt: '2025-01-15T09:00:00Z',
  updatedAt: '2025-01-15T09:00:00Z',
  category: MOCK_CATEGORIES.find(c => c.id === catId),
});

const MOCK_PRODUCTS: Product[] = [
  mkProduct('p-1',  'cat-1', 'Türk Kahvesi',    35,   20,   true,  'Geleneksel köpüklü Türk kahvesi'),
  mkProduct('p-2',  'cat-1', 'Sütlü Kahve',      45,   15,   true),
  mkProduct('p-3',  'cat-1', 'Çay',              15,   null, true,  'Demlik çay'),
  mkProduct('p-4',  'cat-1', 'Espresso',         40,   10,   true),
  mkProduct('p-5',  'cat-1', 'Sıcak Çikolata',   55,    5,   true,  'Sütlü sıcak çikolata'),
  mkProduct('p-6',  'cat-2', 'Soğuk Kahve',      55,    8,   true),
  mkProduct('p-7',  'cat-2', 'Limonata',         45,    0,   true,  'Taze sıkılmış limon'),
  mkProduct('p-8',  'cat-2', 'Ice Tea',          40,   12,   true),
  mkProduct('p-9',  'cat-2', 'Smoothie',         65,    3,   true,  'Mevsim meyveli'),
  mkProduct('p-10', 'cat-3', 'Cheesecake',       75,    6,   true,  'New York style'),
  mkProduct('p-11', 'cat-3', 'Brownie',          55,    0,   false, 'Çikolatalı'),
  mkProduct('p-12', 'cat-4', 'Karışık Tost',     60,   null, true),
  mkProduct('p-13', 'cat-4', 'Kaşarlı Tost',     55,   null, true),
  mkProduct('p-14', 'cat-5', 'Kruvasan',         45,    4,   true),
  mkProduct('p-15', 'cat-5', 'Kek Dilimi',       35,    2,   true),
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts]             = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch]                 = useState('');
  const [filterCat, setFilterCat]           = useState<string>('all');
  const [filterStatus, setFilterStatus]     = useState<'all' | 'active' | 'passive'>('all');
  const [isFormOpen, setIsFormOpen]         = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Stats
  const totalCount   = products.length;
  const activeCount  = products.filter(p => p.isActive).length;
  const passiveCount = products.filter(p => !p.isActive).length;
  const outOfStock   = products.filter(p => p.stock === 0).length;

  // ── Filtered list
  const filtered = useMemo(() =>
    products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat    = filterCat === 'all' || p.categoryId === filterCat;
      const matchStatus =
        filterStatus === 'all'      ? true
        : filterStatus === 'active' ? p.isActive
        : !p.isActive;
      return matchSearch && matchCat && matchStatus;
    }),
  [products, search, filterCat, filterStatus]);

  // ── Handlers
  const handleOpenNew = () => { setEditingProduct(null); setIsFormOpen(true); };
  const handleEdit    = (p: Product) => { setEditingProduct(p); setIsFormOpen(true); };

  const handleFormSubmit = (
    data: Omit<Product, 'id' | 'businessId' | 'createdAt' | 'updatedAt' | 'category'>
  ) => {
    setIsSubmitting(true);
    // Simulate API call — replace with real API call later
    setTimeout(() => {
      if (editingProduct) {
        setProducts(prev => prev.map(p =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...data,
                category: MOCK_CATEGORIES.find(c => c.id === data.categoryId),
                updatedAt: new Date().toISOString(),
              }
            : p
        ));
      } else {
        const newProd: Product = {
          id:         `p-${Date.now()}`,
          businessId: 'biz-1',
          ...data,
          category:   MOCK_CATEGORIES.find(c => c.id === data.categoryId),
          createdAt:  new Date().toISOString(),
          updatedAt:  new Date().toISOString(),
        };
        setProducts(prev => [...prev, newProd]);
      }
      setIsSubmitting(false);
      setIsFormOpen(false);
      setEditingProduct(null);
    }, 600);
  };

  const handleToggleActive = (id: string, currentState: boolean) => {
    setProducts(prev => prev.map(p =>
      p.id === id
        ? { ...p, isActive: !currentState, updatedAt: new Date().toISOString() }
        : p
    ));
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    setProducts(prev => prev.filter(p => p.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <AdminLayout title="Ürünler">
      <div className="space-y-6 animate-fade-in">

        {/* ── Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Ürünler</h1>
            <p className="text-sm text-white/40 mt-0.5">
              Menü ürünlerinizi yönetin ve düzenleyin
            </p>
          </div>
          <button
            id="btn-new-product"
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-900/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Ürün Ekle
          </button>
        </div>

        {/* ── Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Toplam Ürün', value: totalCount,   icon: ShoppingBag,   color: 'brand'   },
            { label: 'Aktif',       value: activeCount,  icon: PackageCheck,  color: 'emerald' },
            { label: 'Pasif',       value: passiveCount, icon: PackageX,      color: 'gray'    },
            { label: 'Tükendi',     value: outOfStock,   icon: AlertTriangle, color: 'red'     },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  color === 'brand'   ? 'bg-brand-500/15'   :
                  color === 'emerald' ? 'bg-emerald-500/15' :
                  color === 'red'     ? 'bg-red-500/15'     : 'bg-white/[0.08]'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    color === 'brand'   ? 'text-brand-400'   :
                    color === 'emerald' ? 'text-emerald-400' :
                    color === 'red'     ? 'text-red-400'     : 'text-white/30'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/40">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="flex-1 glass rounded-2xl flex items-center gap-2.5 px-3">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              id="product-search"
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none py-3"
            />
          </div>

          {/* Category filter */}
          <select
            id="product-filter-category"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="glass rounded-2xl px-4 py-3 text-sm text-white/70 bg-transparent outline-none cursor-pointer appearance-none min-w-[160px]"
          >
            <option value="all" className="bg-[#0f0f1a]">Tüm Kategoriler</option>
            {MOCK_CATEGORIES.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0f0f1a]">{c.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <div className="glass rounded-2xl p-1 flex items-center gap-1">
            {(['all', 'active', 'passive'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterStatus === f
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
              <span className="text-white font-semibold">{filtered.length}</span> ürün listeleniyor
            </p>
          </div>
          <ProductTable
            products={filtered}
            onEdit={handleEdit}
            onDelete={id => setDeleteConfirmId(id)}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      {/* ── Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
        onSubmit={handleFormSubmit}
        editingProduct={editingProduct}
        categories={MOCK_CATEGORIES}
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
            <h3 className="text-lg font-semibold text-white mb-1">Ürünü Sil</h3>
            <p className="text-sm text-white/45 mb-6">
              Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
              >
                İptal
              </button>
              <button
                id="btn-confirm-delete-product"
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
