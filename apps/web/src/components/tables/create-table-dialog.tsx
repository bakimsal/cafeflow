'use client';

import { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTableDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  loading?: boolean;
}

export default function CreateTableDialog({ open, onClose, onCreate, loading = false }: CreateTableDialogProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setName(''); setError(null); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) { setError('Masa adı boş bırakılamaz.'); return; }
    try { await onCreate(trimmed); setName(''); onClose(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Masa oluşturulamadı.'); }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[440px] bg-[#1a1a26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        role="dialog" aria-modal="true" aria-labelledby="create-table-title">
        {/* Header */}
        <div className="flex items-start gap-3.5 p-5 pb-4 relative">
          <span className="text-2xl mt-0.5 shrink-0">🪑</span>
          <div>
            <h2 id="create-table-title" className="text-base font-bold text-white">Yeni Masa Ekle</h2>
            <p className="text-xs text-white/40 mt-0.5">Masa adını girin (örn: Masa 1, Teras-A)</p>
          </div>
          <button id="create-table-close" onClick={onClose} aria-label="Kapat"
            className="absolute top-4 right-4 w-7 h-7 rounded-lg border border-white/8 bg-white/4 text-white/35 flex items-center justify-center hover:bg-white/8 hover:text-white/75 transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-300 text-xs rounded-xl px-3.5 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="table-name" className="text-xs font-medium text-white/55">Masa Adı</label>
            <input
              ref={inputRef}
              id="table-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="örn: Masa 1"
              maxLength={40}
              disabled={loading}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm text-white',
                'bg-white/5 border border-white/10 outline-none',
                'placeholder:text-white/20 transition-all duration-200',
                'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            />
          </div>

          <div className="flex gap-2.5">
            <button type="button" id="create-table-cancel" onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/5 text-white/45 border border-white/8 hover:bg-white/8 transition-all disabled:opacity-45">
              İptal
            </button>
            <button type="submit" id="create-table-submit" disabled={loading || !name.trim()}
              className={cn(
                'flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2',
                'bg-gradient-to-r from-brand-400 to-brand-700 shadow-md shadow-brand-900/30',
                'hover:opacity-88 transition-all disabled:opacity-40 disabled:cursor-not-allowed',
              )}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Oluşturuluyor…</> : 'Masa Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
