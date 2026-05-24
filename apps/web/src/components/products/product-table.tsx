'use client';

import { Pencil, Trash2, ShoppingBag, ImageOff, AlertTriangle } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentState: boolean) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <ShoppingBag className="w-7 h-7 text-white/20" />
        </div>
        <p className="text-white/40 font-medium">Henüz ürün yok</p>
        <p className="text-white/25 text-sm mt-1">Yeni ürün ekleyerek başlayın</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Ürün
            </th>
            <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Kategori
            </th>
            <th className="text-right py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Fiyat
            </th>
            <th className="text-center py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Stok
            </th>
            <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
              Durum
            </th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => {
            const isOutOfStock = product.stock !== null && product.stock === 0;
            const isLowStock   = product.stock !== null && product.stock > 0 && product.stock <= 5;

            return (
              <tr
                key={product.id}
                className={cn(
                  'group border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]',
                  idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
                )}
              >
                {/* Product */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/[0.06] flex items-center justify-center">
                      {product.imageUrl ? (
                        <>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={e => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const fallback = (e.target as HTMLImageElement).nextElementSibling;
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                          />
                          <span
                            className="w-full h-full items-center justify-center"
                            style={{ display: 'none' }}
                          >
                            <ImageOff className="w-4 h-4 text-white/20" />
                          </span>
                        </>
                      ) : (
                        <ImageOff className="w-4 h-4 text-white/20" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-white/85 leading-tight">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-white/35 mt-0.5 max-w-[200px] truncate">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.06] text-white/50 text-xs">
                    {product.category?.name ?? '—'}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 text-right">
                  <span className="text-brand-400 font-semibold">
                    ₺{product.price.toFixed(2)}
                  </span>
                </td>

                {/* Stock */}
                <td className="py-3 px-4 text-center">
                  {product.stock === null ? (
                    <span className="text-white/30 text-xs">∞</span>
                  ) : isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      Tükendi
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      {product.stock}
                    </span>
                  ) : (
                    <span className="text-white/55 text-sm font-medium">{product.stock}</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => onToggleActive(product.id, product.isActive)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all',
                      product.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-white/5 text-white/35 hover:bg-white/10'
                    )}
                  >
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        product.isActive ? 'bg-emerald-400 animate-pulse-dot' : 'bg-white/25'
                      )}
                    />
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </td>

                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(product)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                      title="Düzenle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
