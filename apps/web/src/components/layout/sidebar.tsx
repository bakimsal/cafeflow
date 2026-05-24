'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Armchair,
  ClipboardList,
  CreditCard,
  BarChart3,
  UtensilsCrossed,
  Receipt,
  Tag,
  Package,
  LogOut,
  Coffee,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/tables',     label: 'Masalar',      icon: Armchair },
  { href: '/orders',     label: 'Siparişler',   icon: ClipboardList },
  { href: '/payments',   label: 'Ödemeler',     icon: CreditCard },
  { href: '/categories', label: 'Kategoriler',  icon: Tag },
  { href: '/products',   label: 'Ürünler',      icon: Package },
  { href: '/expenses',   label: 'Giderler',     icon: Receipt },
  { href: '/reports',    label: 'Raporlar',     icon: BarChart3 },
];

const EXTERNAL_ITEMS = [
  { href: '/menu', label: 'QR Menü Önizle', icon: UtensilsCrossed },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] z-50 flex flex-col bg-[#0c0c14] border-r border-white/[0.06] px-3 py-5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-7">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-md shadow-brand-900/40 shrink-0">
          <Coffee className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">CafeFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/25 tracking-widest uppercase px-3 mb-1">
          Yönetim
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-white/40 hover:text-white/75 hover:bg-white/5',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-white/[0.05]" />

        <p className="text-[10px] font-semibold text-white/25 tracking-widest uppercase px-3 mb-1">
          Müşteri
        </p>
        {EXTERNAL_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-white/40 hover:text-white/75 hover:bg-white/5',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Logout */}
      <div className="pt-3 border-t border-white/[0.06]">
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
