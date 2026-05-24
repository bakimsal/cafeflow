'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth';
import { Coffee } from 'lucide-react';

export default function MenuIndexPage() {
  const router = useRouter();
  const user = getStoredUser();

  useEffect(() => {
    // Business slug varsa QR menüye yönlendir
    // Yoksa dashboard'a geri al
    if (user) {
      router.replace('/dashboard');
    }
  }, [router, user]);

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center gap-4 text-white/40">
      <Coffee className="w-10 h-10 animate-pulse" />
      <p className="text-sm">Yönlendiriliyor…</p>
      <p className="text-xs text-white/20 mt-2">
        QR menüye erişmek için:{' '}
        <code className="bg-white/5 px-2 py-0.5 rounded text-brand-400">
          /menu/[isletme-slug]
        </code>
      </p>
    </div>
  );
}
