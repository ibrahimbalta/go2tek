'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Go2TekLogo } from '@/components/layout/Go2TekLogo';

export default function SecureAdminPortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Giriş başarısız.');
      } else {
        router.push('/yonetim');
        router.refresh();
      }
    } catch {
      setError('Sunucu bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Go2TekLogo variant="light" size="sm" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md shadow-red-600/25">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-900">
              Yetkili Yönetim Girişi
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Go2Tek Kapalı Devre Yönetim & Operasyon Merkezi
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Kurumsal E-posta
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              placeholder="ornek@go2tek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-extrabold shadow-lg shadow-red-600/20 transition disabled:opacity-50"
          >
            {loading ? 'Doğrulanıyor...' : 'Güvenli Giriş Yap'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Yetkisiz erişim denemeleri kayıt altına alınmaktadır.</span>
        </div>
      </div>
    </div>
  );
}
