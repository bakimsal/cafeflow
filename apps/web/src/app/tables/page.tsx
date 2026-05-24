'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/admin-layout';
import TableCard from '@/components/tables/table-card';
import CreateTableDialog from '@/components/tables/create-table-dialog';
import { tablesApi } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { Table, TableStatus } from '@/types';

const FILTERS: { value: TableStatus | 'ALL'; label: string }[] = [
  { value: 'ALL',           label: 'Tümü' },
  { value: 'EMPTY',         label: 'Boş' },
  { value: 'OCCUPIED',      label: 'Dolu' },
  { value: 'WAITING_ORDER', label: 'Sipariş Bekli' },
  { value: 'ASKING_BILL',   label: 'Hesap İstedi' },
  { value: 'CLOSED',        label: 'Kapalı' },
];

const MOCK_TABLES: Table[] = [
  { id: '1', branchId: 'b1', name: 'Masa 1',  qrCode: null, status: 'EMPTY',         createdAt: '', updatedAt: '' },
  { id: '2', branchId: 'b1', name: 'Masa 2',  qrCode: null, status: 'OCCUPIED',      createdAt: '', updatedAt: '', activeOrder: { id: 'o1', tableId: '2', branchId: 'b1', status: 'OPEN', totalAmount: 145.50, source: 'CASHIER', note: null, createdAt: '', updatedAt: '', items: [{} as any, {} as any, {} as any] } },
  { id: '3', branchId: 'b1', name: 'Masa 3',  qrCode: null, status: 'WAITING_ORDER', createdAt: '', updatedAt: '' },
  { id: '4', branchId: 'b1', name: 'Teras 1', qrCode: null, status: 'ASKING_BILL',   createdAt: '', updatedAt: '', activeOrder: { id: 'o2', tableId: '4', branchId: 'b1', status: 'CONFIRMED', totalAmount: 89.00, source: 'QR_MENU', note: null, createdAt: '', updatedAt: '', items: [{} as any, {} as any] } },
  { id: '5', branchId: 'b1', name: 'Teras 2', qrCode: null, status: 'EMPTY',         createdAt: '', updatedAt: '' },
  { id: '6', branchId: 'b1', name: 'VIP',     qrCode: null, status: 'CLOSED',        createdAt: '', updatedAt: '' },
];

export default function TablesPage() {
  const [tables, setTables]     = useState<Table[]>([]);
  const [filter, setFilter]     = useState<TableStatus | 'ALL'>('ALL');
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = getStoredUser();

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tablesApi.getAll(user?.branchId ?? undefined) as Table[];
      setTables(data);
    } catch {
      setTables(MOCK_TABLES);
    } finally {
      setLoading(false);
    }
  }, [user?.branchId]);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  async function handleStatusChange(id: string, status: TableStatus) {
    try { await tablesApi.updateStatus(id, status); } catch { /* offline */ }
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu masayı silmek istediğinizden emin misiniz?')) return;
    try { await tablesApi.delete(id); } catch { /* offline */ }
    setTables((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleCreate(name: string) {
    setCreating(true);
    try {
      const t = await tablesApi.create({ branchId: user?.branchId ?? 'default', name }) as Table;
      setTables((prev) => [...prev, t]);
    } catch {
      const mock: Table = { id: Date.now().toString(), branchId: user?.branchId ?? 'b1', name, qrCode: null, status: 'EMPTY', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setTables((prev) => [...prev, mock]);
    } finally {
      setCreating(false);
    }
  }

  const filtered = filter === 'ALL' ? tables : tables.filter((t) => t.status === filter);
  const counts = {
    total:    tables.length,
    occupied: tables.filter((t) => t.status !== 'EMPTY' && t.status !== 'CLOSED').length,
    empty:    tables.filter((t) => t.status === 'EMPTY').length,
  };

  return (
    <AdminLayout title="Masalar">
      <div className="flex flex-col gap-5 max-w-[1400px]">

        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-sm text-white/40">
            <span><span className="font-bold text-white">{counts.total}</span> toplam</span>
            <span className="text-white/15">·</span>
            <span><span className="font-bold text-blue-400">{counts.occupied}</span> dolu</span>
            <span className="text-white/15">·</span>
            <span><span className="font-bold text-green-400">{counts.empty}</span> boş</span>
          </div>
          <div className="flex items-center gap-2">
            <button id="tables-refresh" onClick={fetchTables} disabled={loading} aria-label="Yenile"
              className="w-9 h-9 rounded-xl border border-white/8 bg-white/4 text-white/40 flex items-center justify-center hover:bg-white/8 hover:text-white/75 transition-all disabled:opacity-50">
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </button>
            <button id="tables-add" onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-400 to-brand-700 shadow-md shadow-brand-900/30 hover:opacity-88 hover:-translate-y-px transition-all">
              <Plus className="w-4 h-4" /> Yeni Masa
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f.value} id={`filter-${f.value}`}
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                filter === f.value
                  ? 'bg-brand-500/12 text-brand-400 border-brand-500/30'
                  : 'bg-white/4 text-white/40 border-white/8 hover:bg-white/7 hover:text-white/70',
              )}>
              {f.label}
              {f.value !== 'ALL' && (
                <span className={cn('text-[10px] font-bold px-1.5 py-px rounded-full', filter === f.value ? 'bg-brand-500/15' : 'bg-white/8')}>
                  {tables.filter((t) => t.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] bg-[length:200%_100%] animate-shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <span className="text-5xl">🪑</span>
            <p className="text-sm font-semibold text-white/35">
              {filter === 'ALL' ? 'Henüz masa yok' : 'Bu durumda masa yok'}
            </p>
            {filter === 'ALL' && (
              <button onClick={() => setDialogOpen(true)}
                className="mt-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-400 to-brand-700 hover:opacity-88 transition-all">
                İlk masayı ekle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {filtered.map((table) => (
              <TableCard key={table.id} table={table} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <CreateTableDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreate={handleCreate} loading={creating} />
    </AdminLayout>
  );
}
