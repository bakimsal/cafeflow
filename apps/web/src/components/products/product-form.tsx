'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, ShoppingBag, ImageOff } from 'lucide-react';
import type { Product, Category } from '@/types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'businessId' | 'createdAt' | 'updatedAt' | 'category'>) => void;
  editingProduct?: Product | null;
  categories: Category[];
  isLoading?: boolean;
}

const EMPTY_FORM = {
  categoryId:  '',
  name:        '',
  description: '',
  price:       '' as string | number,
  imageUrl:    '',
  stock:       '' as string | number,
  isActive:    true,
};

type FormErrors = Partial<Record<keyof typeof EMPTY_FORM, string>>;

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  categories,
  isLoading = false,
}: ProductFormProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingProduct) {
      setForm({
        categoryId:  editingProduct.categoryId,
        name:        editingProduct.name,
        description: editingProduct.description ?? '',
        price:       editingProduct.price,
        imageUrl:    editingProduct.imageUrl ?? '',
        stock:       editingProduct.stock ?? '',
        isActive:    editingProduct.isActive,
      });
    } else {
      setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
    }
    setErrors({});
  }, [editingProduct, isOpen, categories]);

  const set = (key: keyof typeof EMPTY_FORM, val: unknown) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim())
      errs.name = 'Ürün adı zorunludur.';
    if (!form.categoryId)
      errs.categoryId = 'Kategori seçiniz.';
    if (form.price === '' || Number(form.price) < 0)
      errs.price = 'Geçerli bir fiyat giriniz.';
    if (form.stock !== '' && Number(form.stock) < 0)
      errs.stock = 'Stok 0 veya daha büyük olmalıdır.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      categoryId:  form.categoryId,
      name:        form.name.trim(),
      description: form.description.trim() || null,
      price:       Number(form.price),
      imageUrl:    form.imageUrl.trim() || null,
      stock:       form.stock !== '' ? Number(form.stock) : null,
      isActive:    form.isActive,
    });
  };

  if (!isOpen) return null;

  const inputCls = (field: keyof typeof EMPTY_FORM) =>
    `w-full px-3.5 py-2.5 bg-white/5 border rounded-xl text-white placeholder-white/25 text-sm focus:outline-none transition-all ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500'
        : 'border-white/10 focus:border-brand-500/50 focus:bg-white/[0.08]'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 p-6 pb-4 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
            </h2>
            <p className="text-xs text-white/40">
              {editingProduct ? 'Ürün bilgilerini güncelleyin' : 'Menüye yeni ürün ekleyin'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Ürün Adı <span className="text-brand-400">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Örn: Türk Kahvesi"
                className={inputCls('name')}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Kategori <span className="text-brand-400">*</span>
              </label>
              <select
                id="product-category"
                value={form.categoryId}
                onChange={e => set('categoryId', e.target.value)}
                className={`${inputCls('categoryId')} appearance-none cursor-pointer`}
              >
                <option value="" disabled className="bg-[#0f0f1a]">Kategori seçin</option>
                {categories.filter(c => c.isActive).map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0f0f1a]">{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1.5 text-xs text-red-400">{errors.categoryId}</p>}
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Fiyat (₺) <span className="text-brand-400">*</span>
                </label>
                <input
                  id="product-price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="0.00"
                  className={inputCls('price')}
                />
                {errors.price && <p className="mt-1.5 text-xs text-red-400">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Stok{' '}
                  <span className="text-white/30 font-normal">(isteğe bağlı)</span>
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={e => set('stock', e.target.value)}
                  placeholder="Sınırsız"
                  className={inputCls('stock')}
                />
                {errors.stock && <p className="mt-1.5 text-xs text-red-400">{errors.stock}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Açıklama{' '}
                <span className="text-white/30 font-normal">(isteğe bağlı)</span>
              </label>
              <textarea
                id="product-description"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Ürün hakkında kısa bir açıklama..."
                rows={3}
                className={`${inputCls('description')} resize-none`}
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Görsel URL{' '}
                <span className="text-white/30 font-normal">(isteğe bağlı)</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="product-image-url"
                  type="url"
                  value={form.imageUrl}
                  onChange={e => set('imageUrl', e.target.value)}
                  placeholder="https://..."
                  className={`${inputCls('imageUrl')} flex-1`}
                />
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 shrink-0">
                    <ImageOff className="w-4 h-4 text-white/20" />
                  </div>
                )}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/[0.08]">
              <div>
                <p className="text-sm font-medium text-white/80">Aktif</p>
                <p className="text-xs text-white/35 mt-0.5">Pasif ürünler QR menüde görünmez</p>
              </div>
              <button
                type="button"
                id="product-active-toggle"
                onClick={() => set('isActive', !form.isActive)}
                className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                  form.isActive ? 'bg-brand-500' : 'bg-white/15'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    form.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/[0.06] flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            İptal
          </button>
          <button
            type="submit"
            form="product-form"
            id="product-form-submit"
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingProduct ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}
