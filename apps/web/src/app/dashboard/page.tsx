'use client';

import AdminLayout from '@/components/layout/admin-layout';
import { TrendingUp, Armchair, ClipboardList, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATS = [
  { id: 'total-revenue',  label: 'Bugünkü Ciro',   value: '₺0',  sub: 'Henüz ödeme yok',    icon: TrendingUp,    color: 'text-brand-400 bg-brand-500/10 border-brand-500/20' },
  { id: 'open-tables',    label: 'Açık Masalar',    value: '0',   sub: 'Aktif masa yok',       icon: Armchair,      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'active-orders',  label: 'Aktif Sipariş',   value: '0',   sub: 'Bekleyen sipariş yok', icon: ClipboardList, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  { id: 'daily-expenses', label: 'Günlük Gider',    value: '₺0',  sub: 'Gider kaydı yok',     icon: ShieldAlert,   color: 'text-red-400 bg-red-500/10 border-red-500/20' },
];

const COMING_SOON = [
  { title: 'Satış Grafiği',        desc: 'Backend bağlandığında günlük/haftalık satış grafiği burada görünecek.' },
  { title: 'Son İşlemler',          desc: 'Son ödemeleri ve sipariş hareketlerini buradan takip edebilirsiniz.' },
  { title: 'En Çok Satan Ürünler', desc: 'Hangi ürünlerin daha fazla satıldığını analiz edin.' },
];

export default function DashboardPage() {
  const dateStr = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AdminLayout title="Dashboard">
      <div className="flex flex-col gap-7 max-w-[1400px]">

        {/* Greeting */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Hoş geldiniz 👋</h2>
            <p className="text-sm text-white/40 capitalize mt-0.5">{dateStr}</p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistem Aktif
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {STATS.map(({ id, label, value, sub, icon: Icon, color }) => (
            <div key={id} id={id}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 hover:-translate-y-0.5 hover:border-white/12 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-white/45">{label}</span>
                <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center shrink-0', color)}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white tracking-tight leading-none mb-1">{value}</p>
              <p className="text-xs text-white/30">{sub}</p>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {COMING_SOON.map(({ title, desc }) => (
            <div key={title} className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl border border-white/8 bg-white/4 flex items-center justify-center text-white/25">
                <span className="text-lg">📊</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white/55">{title}</h3>
              <p className="text-xs text-white/28 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
