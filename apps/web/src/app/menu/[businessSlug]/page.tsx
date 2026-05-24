'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ShoppingCart, X, ChevronDown, ChevronUp, Minus, Plus,
  Send, CheckCircle2, Coffee, AlertCircle,
} from 'lucide-react';
import type { Category, Product } from '@/types';
import CategoryTabs from '@/components/menu/category-tabs';
import ProductCard   from '@/components/menu/product-card';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  product:  Product;
  quantity: number;
  note:     string;
}

interface MenuData {
  businessName: string;
  businessLogo: string | null;
  categories:   Category[];
  products:     Product[];
}

// ─── Mock API ─────────────────────────────────────────────────────────────────
// TODO: Replace with real API call → GET /api/public/menu/:businessSlug
async function fetchMenuData(_slug: string): Promise<MenuData> {
  await new Promise(r => setTimeout(r, 700));

  const categories: Category[] = [
    { id: 'cat-1', businessId: 'biz-1', name: 'Sıcak İçecekler', sortOrder: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'cat-2', businessId: 'biz-1', name: 'Soğuk İçecekler', sortOrder: 2, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'cat-3', businessId: 'biz-1', name: 'Tatlılar',        sortOrder: 3, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'cat-4', businessId: 'biz-1', name: 'Tostlar',         sortOrder: 4, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'cat-5', businessId: 'biz-1', name: 'Atıştırmalıklar', sortOrder: 5, isActive: true, createdAt: '', updatedAt: '' },
  ];

  const mk = (
    id: string, catId: string, name: string, price: number,
    stock: number | null, description?: string
  ): Product => ({
    id, businessId: 'biz-1', categoryId: catId, name,
    description: description ?? null, price,
    imageUrl: null, stock, isActive: true,
    createdAt: '', updatedAt: '',
    category: categories.find(c => c.id === catId),
  });

  const products: Product[] = [
    mk('p-1',  'cat-1', 'Türk Kahvesi',   35,   20, 'Geleneksel köpüklü Türk kahvesi'),
    mk('p-2',  'cat-1', 'Sütlü Kahve',    45,   15, 'Kremşanti veya süt seçeneğiyle'),
    mk('p-3',  'cat-1', 'Çay',            15, null, 'Demlik çay, istediğiniz kadar'),
    mk('p-4',  'cat-1', 'Espresso',       40,   10, 'Yoğun ve aromatik'),
    mk('p-5',  'cat-1', 'Sıcak Çikolata', 55,    5, 'Sütlü sıcak çikolata'),
    mk('p-6',  'cat-2', 'Soğuk Kahve',    55,    8, 'Buz ve süt ile servis'),
    mk('p-7',  'cat-2', 'Limonata',       45,    0, 'Taze sıkılmış limon'),
    mk('p-8',  'cat-2', 'Ice Tea',        40,   12, 'Şeftali veya limon aromalı'),
    mk('p-9',  'cat-2', 'Smoothie',       65,    3, 'Mevsim meyveli, tam meyve'),
    mk('p-10', 'cat-3', 'Cheesecake',     75,    6, 'New York usulü, çilekli'),
    mk('p-11', 'cat-3', 'Brownie',        55,    4, 'Çikolatalı, cevizli'),
    mk('p-12', 'cat-4', 'Karışık Tost',   60, null, 'Kaşar, sucuk, domates'),
    mk('p-13', 'cat-4', 'Kaşarlı Tost',   55, null, 'Sade kaşarlı'),
    mk('p-14', 'cat-5', 'Kruvasan',       45,    4, 'Tereyağlı, çıtır'),
    mk('p-15', 'cat-5', 'Kek Dilimi',     35,    2, 'Günlük taze kek'),
  ];

  return { businessName: 'Kahve Durağı', businessLogo: null, categories, products };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QRMenuPage() {
  const params       = useParams<{ businessSlug: string }>();
  const searchParams = useSearchParams();

  const businessSlug = params.businessSlug;
  const tableParam   = searchParams.get('table');
  const tableNumber  = tableParam ? `Masa ${tableParam}` : null;

  // ── Data state
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // ── UI state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart]                     = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen]         = useState(false);
  const [orderSent, setOrderSent]           = useState(false);
  const [isSending, setIsSending]           = useState(false);

  // ── Fetch menu on mount
  useEffect(() => {
    fetchMenuData(businessSlug)
      .then(data => { setMenuData(data); setLoading(false); })
      .catch(() => { setError('Menü yüklenemedi. Lütfen tekrar deneyin.'); setLoading(false); });
  }, [businessSlug]);

  // ── Derived data
  const visibleProducts = useMemo(() => {
    if (!menuData) return [];
    const active = menuData.products.filter(p => p.isActive);
    if (activeCategory === 'all') return active;
    return active.filter(p => p.categoryId === activeCategory);
  }, [menuData, activeCategory]);

  const productCountMap = useMemo(() => {
    if (!menuData) return {};
    return menuData.categories.reduce<Record<string, number>>((acc, cat) => {
      acc[cat.id] = menuData.products.filter(p => p.isActive && p.categoryId === cat.id).length;
      return acc;
    }, {});
  }, [menuData]);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const getQty    = (id: string) => cart.find(i => i.product.id === id)?.quantity ?? 0;

  // ── Cart handlers
  const handleAdd = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      return existing
        ? prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1, note: '' }];
    });
  }, []);

  const handleRemove = useCallback((productId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === productId);
      if (!existing) return prev;
      return existing.quantity === 1
        ? prev.filter(i => i.product.id !== productId)
        : prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  }, []);

  const handleNoteChange = (productId: string, note: string) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, note } : i));
  };

  // ── Send order
  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    setIsSending(true);
    // TODO: Replace with real API call → POST /api/public/orders
    await new Promise(r => setTimeout(r, 1200));
    setIsSending(false);
    setIsCartOpen(false);
    setCart([]);
    setOrderSent(true);
  };

  // ── Loading skeleton
  if (loading) return <MenuSkeleton />;

  // ── Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">Hata</h2>
        <p className="text-white/45 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  // ── Order success
  if (orderSent) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5 animate-pulse-dot">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Siparişiniz Alındı!</h2>
        <p className="text-white/45 text-sm max-w-xs">
          Siparişiniz mutfağa iletildi. Kısa süre içinde hazırlanacak.
        </p>
        {tableNumber && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <p className="text-brand-400 text-sm font-semibold">{tableNumber}</p>
          </div>
        )}
        <button
          onClick={() => setOrderSent(false)}
          className="mt-6 px-6 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-all"
        >
          Menüye Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] flex flex-col">

      {/* ── Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center max-w-lg mx-auto gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-md shadow-brand-900/40 shrink-0">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-white leading-tight">
              {menuData!.businessName}
            </p>
            {tableNumber && (
              <p className="text-xs text-brand-400 font-medium">{tableNumber}</p>
            )}
          </div>
        </div>
      </header>

      {/* ── Category Tabs */}
      <div className="sticky top-[61px] z-20 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-white/[0.04] py-2">
        <div className="max-w-lg mx-auto">
          <CategoryTabs
            categories={menuData!.categories}
            activeId={activeCategory}
            onChange={setActiveCategory}
            productCountMap={productCountMap}
          />
        </div>
      </div>

      {/* ── Product List */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-32">
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-white/30 font-medium">Bu kategoride ürün bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {visibleProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getQty(product.id)}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Floating Cart Button */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-900/50 transition-all active:scale-95 max-w-sm w-full"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-brand-600 text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="flex-1 text-left font-semibold text-[15px]">
              Sepeti Görüntüle
            </span>
            <span className="font-bold text-[15px]">₺{cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* ── Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <div className="relative bg-[#0f0f1a] border-t border-white/[0.08] rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-bold text-white">Sepetim</h2>
                <p className="text-xs text-white/40">{cartCount} ürün</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
              {cart.map(item => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onAdd={() => handleAdd(item.product)}
                  onRemove={() => handleRemove(item.product.id)}
                  onNoteChange={note => handleNoteChange(item.product.id, note)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-white/[0.06] space-y-3">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Toplam</span>
                <span className="text-white font-bold text-lg">₺{cartTotal.toFixed(2)}</span>
              </div>

              {/* Table info */}
              {tableNumber && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500/[0.08] border border-brand-500/15">
                  <span className="text-xs text-brand-400 font-medium">📍 {tableNumber}</span>
                </div>
              )}

              {/* Send button */}
              <button
                onClick={handleSendOrder}
                disabled={isSending}
                className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sipariş Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Siparişi Gönder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cart Item Row ─────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  onAdd,
  onRemove,
  onNoteChange,
}: {
  item: CartItem;
  onAdd: () => void;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
}) {
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.06]">
      <div className="flex items-center gap-3">
        {/* Name + Price */}
        <div className="flex-1 min-w-0">
          <p className="text-white/85 font-medium text-sm truncate">{item.product.name}</p>
          <p className="text-brand-400 text-sm font-semibold mt-0.5">
            ₺{(item.product.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Note toggle */}
        <button
          onClick={() => setShowNote(s => !s)}
          className="text-white/30 hover:text-white/60 transition-colors"
        >
          {showNote ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Qty controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-white/60 hover:bg-white/15 transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-white font-bold text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={onAdd}
            className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 hover:bg-brand-500/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note input */}
      {showNote && (
        <div className="mt-2.5">
          <input
            type="text"
            placeholder="Not ekle... (Örn: az şekerli)"
            value={item.note}
            onChange={e => onNoteChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/80 placeholder-white/25 text-xs focus:outline-none focus:border-brand-500/40 transition-all"
          />
        </div>
      )}
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function MenuSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <div className="h-[61px] border-b border-white/[0.06] px-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/[0.06] animate-pulse" />
        <div className="space-y-1.5">
          <div className="w-32 h-3.5 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="w-16 h-2.5 rounded-full bg-white/[0.04] animate-pulse" />
        </div>
      </div>
      <div className="h-[50px] border-b border-white/[0.04] flex items-center gap-2 px-4">
        {[60, 90, 75, 80, 65].map((w, i) => (
          <div key={i} className="h-8 rounded-full bg-white/[0.06] animate-pulse shrink-0" style={{ width: w }} />
        ))}
      </div>
      <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/[0.04] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
