'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Coffee, AlertCircle, Loader2 } from 'lucide-react';
import { login } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await login(email, password);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Giriş başarısız.');
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-30 -top-40 -left-24 blur-[80px] animate-float"
        style={{ background: 'radial-gradient(circle, #c8793a 0%, #7c3a00 100%)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-25 -bottom-32 -right-20 blur-[80px]"
        style={{ background: 'radial-gradient(circle, #3a4fc8 0%, #1a0050 100%)', animationDelay: '-4s' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] glass rounded-3xl p-10 shadow-2xl animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/40">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">CafeFlow</span>
        </div>

        <h1 className="text-2xl font-bold text-white text-center tracking-tight mb-1">Hoş Geldiniz</h1>
        <p className="text-sm text-white/40 text-center mb-7">Devam etmek için giriş yapın</p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-5 animate-slide-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-white/60">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@cafe.com"
              disabled={isPending}
              required
              autoComplete="email"
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm text-white',
                'bg-white/5 border border-white/10 outline-none',
                'placeholder:text-white/20 transition-all duration-200',
                'focus:border-brand-500 focus:bg-white/8 focus:ring-2 focus:ring-brand-500/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-white/60">Şifre</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isPending}
                required
                autoComplete="current-password"
                className={cn(
                  'w-full px-4 py-3 pr-11 rounded-xl text-sm text-white',
                  'bg-white/5 border border-white/10 outline-none',
                  'placeholder:text-white/20 transition-all duration-200',
                  'focus:border-brand-500 focus:bg-white/8 focus:ring-2 focus:ring-brand-500/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={isPending || !email || !password}
            className={cn(
              'mt-2 w-full py-3.5 rounded-xl font-semibold text-white text-sm',
              'bg-gradient-to-r from-brand-400 to-brand-700',
              'shadow-lg shadow-brand-900/40',
              'flex items-center justify-center gap-2',
              'transition-all duration-200',
              'hover:opacity-90 hover:-translate-y-px',
              'active:scale-[0.98]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0',
            )}
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Giriş yapılıyor…</> : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-8">
          CafeFlow &copy; {new Date().getFullYear()} — Kafe Otomasyon Sistemi
        </p>
      </div>
    </div>
  );
}
