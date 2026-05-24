import type { Table, TableStatus } from '@/types';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import TableStatusBadge from './table-status-badge';

const STATUS_RING: Record<TableStatus, string> = {
  EMPTY:         'border-white/8 bg-white/[0.03]',
  OCCUPIED:      'border-blue-500/20 bg-blue-500/5',
  WAITING_ORDER: 'border-amber-500/20 bg-amber-500/5',
  ASKING_BILL:   'border-brand-500/20 bg-brand-500/6',
  CLOSED:        'border-red-500/15 bg-red-500/4',
};

interface TableCardProps {
  table: Table;
  onStatusChange?: (id: string, status: TableStatus) => void;
  onDelete?: (id: string) => void;
}

export default function TableCard({ table, onStatusChange, onDelete }: TableCardProps) {
  const isActive = table.status !== 'EMPTY' && table.status !== 'CLOSED';

  return (
    <div
      id={`table-card-${table.id}`}
      className={cn(
        'rounded-2xl border p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl',
        STATUS_RING[table.status],
      )}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪑</span>
          <span className="text-base font-bold text-white tracking-tight">{table.name}</span>
        </div>
        <TableStatusBadge status={table.status} pulse={isActive} />
      </div>

      {/* Order info */}
      <div className="min-h-[36px]">
        {table.activeOrder ? (
          <>
            <p className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
              ₺{table.activeOrder.totalAmount.toFixed(2)}
            </p>
            <p className="text-xs text-white/35">{table.activeOrder.items?.length ?? 0} ürün</p>
          </>
        ) : (
          <p className="text-xs text-white/25 pt-1">Aktif sipariş yok</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onStatusChange && (
          <>
            {table.status === 'EMPTY' && (
              <button id={`table-open-${table.id}`} onClick={() => onStatusChange(table.id, 'OCCUPIED')}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-all">
                Masayı Aç
              </button>
            )}
            {table.status === 'OCCUPIED' && (
              <button id={`table-bill-${table.id}`} onClick={() => onStatusChange(table.id, 'ASKING_BILL')}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-brand-500/15 text-brand-400 border border-brand-500/25 hover:bg-brand-500/25 transition-all">
                Hesap Kes
              </button>
            )}
            {(table.status === 'ASKING_BILL' || table.status === 'WAITING_ORDER') && (
              <button id={`table-close-${table.id}`} onClick={() => onStatusChange(table.id, 'EMPTY')}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-green-500/12 text-green-400 border border-green-500/25 hover:bg-green-500/20 transition-all">
                Kapat
              </button>
            )}
          </>
        )}
        {onDelete && table.status === 'EMPTY' && (
          <button id={`table-delete-${table.id}`} onClick={() => onDelete(table.id)} aria-label="Masayı sil"
            className="p-2 rounded-lg text-white/25 bg-white/4 border border-white/8 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
