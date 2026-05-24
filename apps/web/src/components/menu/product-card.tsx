'use client';

import { useState } from 'react';
import { Plus, Minus, ImageOff } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product:  Product;
  quantity: number;
  onAdd:    (product: Product) => void;
  onRemove: (productId: string) => void;
}

export default function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = product.stock !== null && product.stock === 0;
  const inCart       = quantity > 0;

  return (
    <div
      className={cn(
        'relative flex gap-3 p-3.5 rounded-2xl border transition-all duration-200',
        isOutOfStock
          ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
          : inCart
          ? 'bg-brand-500/[0.07] border-brand-500/25 shadow-sm shadow-brand-900/20'
          : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.10] active:scale-[0.99]'
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/[0.06] border border-white/[0.06] flex items-center justify-center shrink-0">
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageOff className="w-6 h-6 text-white/15" />
        )}

        {/* Out-of-stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white/80 rotate-[-10deg]">
              TÜKENDİ
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
        <div>
          <h3 className="font-semibold text-white/90 text-[15px] leading-snug truncate">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-white/40 mt-0.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          {/* Price */}
          <span className="text-brand-400 font-bold text-base">
            ₺{product.price.toFixed(2)}
          </span>

          {/* Counter / Add button */}
          {isOutOfStock ? (
            <span className="text-xs text-white/30 font-medium">Stok yok</span>
          ) : inCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemove(product.id)}
                className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 hover:bg-brand-500/30 transition-all active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-white font-bold text-sm w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={() => onAdd(product)}
                className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-brand-600 transition-all active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAdd(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-semibold hover:bg-brand-500/25 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Ekle
            </button>
          )}
        </div>
      </div>

      {/* In-cart quantity badge */}
      {inCart && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shadow-md shadow-brand-900/50">
          <span className="text-[10px] font-bold text-white">{quantity}</span>
        </div>
      )}
    </div>
  );
}
