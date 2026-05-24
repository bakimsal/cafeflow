'use client';
import AdminLayout from '@/components/layout/admin-layout';
export default function ReportsPage() {
  return (
    <AdminLayout title="Raporlar">
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <span className="text-5xl">📈</span>
        <h2 className="text-lg font-semibold text-white/50">Raporlama ekranı geliştiriliyor</h2>
        <p className="text-sm text-white/25">Bu ekran yakında hazır olacak.</p>
      </div>
    </AdminLayout>
  );
}
