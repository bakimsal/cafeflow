'use client';

import { useState } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStoredUser, logout } from '@/lib/auth';

interface HeaderProps { title?: string; }

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  OWNER:       'İşletme Sahibi',
  MANAGER:     'Müdür',
  CASHIER:     'Kasiyer',
};

export default function Header({ title }: HeaderProps) {
  const user = getStoredUser();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CF';

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 glass-dark border-b border-white/[0.06]">
      {/* Left */}
      <div>
        {title && <h1 className="text-[17px] font-semibold text-white tracking-tight">{title}</h1>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <button
          id="header-notifications"
          aria-label="Bildirimler"
          className="relative w-9 h-9 rounded-xl border border-white/8 bg-white/4 text-white/40 flex items-center justify-center hover:bg-white/8 hover:text-white/75 transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-400 border-2 border-[#080810]" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            id="header-user-menu"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[13px] font-semibold text-white max-w-[100px] truncate">{user?.name || 'Kullanıcı'}</span>
              <span className="text-[11px] text-white/35">{user?.role ? ROLE_LABELS[user.role] : '—'}</span>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 text-white/30 transition-transform', open && 'rotate-180')} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 bg-[#1a1a26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="px-4 py-3 border-b border-white/[0.07]">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-white/35 truncate">{user?.email}</p>
                </div>
                <button
                  id="header-logout"
                  onClick={() => { setOpen(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-white/45 hover:text-red-400 hover:bg-red-500/8 transition-all"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
