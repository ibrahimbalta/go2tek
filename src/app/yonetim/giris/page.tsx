'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, AlertCircle, UserCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@go2tek.com');
  const [password, setPassword] = useState('Go2Tek2026!');
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

  const demoAccounts = [
    { label: 'Genel Yönetici (ADMIN)', email: 'admin@go2tek.com' },
    { label: 'Teknik Kontrol Uzmanı (TECHNICAL_STAFF)', email: 'teknik@go2tek.com' },
    { label: 'Satış & Eşleştirme Uzmanı (SALES_STAFF)', email: 'satis@go2tek.com' },
    { label: 'Finans Yöneticisi (FINANCE_STAFF)', email: 'finans@go2tek.com' },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md shadow-red-600/25">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900">
            Go2Tek Yönetim Merkezi
          </h1>
          <p className="text-xs text-zinc-500">
            Yetkili Yönetici ve Personel Kimlik Doğrulama Sistemi
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kurumsal E-posta
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-extrabold shadow-lg shadow-red-600/20 transition"
          >
            {loading ? 'Doğrulanıyor...' : 'Yönetim Paneline Giriş Yap'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Hızlı Rol Seçimi (Test Hesapları - Şifre: Go2Tek2026!)</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword('Go2Tek2026!');
                }}
                className={`text-left px-3 py-2 rounded-xl border text-xs transition flex items-center justify-between ${
                  email === acc.email
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{acc.label}</span>
                <span className="text-[11px] text-slate-500">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tüm oturum ve işlemler AuditLog tablosunda kayıt altına alınır.</span>
        </div>
      </div>
    </div>
  );
}
