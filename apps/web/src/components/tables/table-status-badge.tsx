import type { TableStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<TableStatus, { label: string; classes: string; dotClass: string }> = {
  EMPTY:         { label: 'Boş',           classes: 'bg-white/5 text-white/45 border-white/10',                        dotClass: 'bg-white/35' },
  OCCUPIED:      { label: 'Dolu',          classes: 'bg-blue-500/10 text-blue-400 border-blue-500/25',                  dotClass: 'bg-blue-500' },
  WAITING_ORDER: { label: 'Sipariş Bekli', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/25',               dotClass: 'bg-amber-500' },
  ASKING_BILL:   { label: 'Hesap İstedi',  classes: 'bg-brand-500/10 text-brand-400 border-brand-500/25',               dotClass: 'bg-brand-400' },
  CLOSED:        { label: 'Kapalı',        classes: 'bg-red-500/8 text-red-400 border-red-500/20',                      dotClass: 'bg-red-500' },
};

interface TableStatusBadgeProps {
  status: TableStatus;
  pulse?: boolean;
}

export default function TableStatusBadge({ status, pulse = false }: TableStatusBadgeProps) {
  const { label, classes, dotClass } = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap', classes)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass, pulse && 'animate-pulse-dot')} />
      {label}
    </span>
  );
}
