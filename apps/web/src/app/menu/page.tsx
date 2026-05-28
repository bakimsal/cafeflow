'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee } from 'lucide-react';

export default function MenuIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // /menu açılınca her zaman dashboard'a yönlendir.
    // Gerçek QR menüye erişim: /menu/[isletme-slug] üzerinden olacak.
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center gap-4 text-white/40">
      <Coffee className="w-10 h-10 animate-pulse text-brand-400" />
      <p className="text-sm">Yönlendiriliyor…</p>
    </div>
  );
}
