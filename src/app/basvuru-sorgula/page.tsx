'use client';

import React, { useState } from 'react';
import { TRANSACTION_STAGES } from '@/lib/constants';
import { FileSearch, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TrackRequestPage() {
  const [referenceNo, setReferenceNo] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    type: string;
    referenceNo: string;
    category: string;
    status: string;
    stageKey: string;
    stageStep: number;
    stageLabel: string;
    stageDescription: string;
    submittedAt: string;
  } | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/requests/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceNo, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Kayıt bulunamadı.');
      } else {
        setResult(data.tracking);
      }
    } catch {
      setError('Sorgulama sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
          <FileSearch className="w-4 h-4" />
          KVKK Uyumlu Güvenli Başvuru Takibi
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Özel Talep & Teklif Durum Sorgulama
        </h1>
        <p className="text-sm text-slate-300">
          Başvuru numaranız ve kayıtlı telefon numaranız ile talebinizin hangi aşamada olduğunu görüntüleyebilirsiniz. Demo test için: Alıcı Talebi{' '}
          <code className="text-blue-300 font-bold">G2T-AL-2026-1042</code> / Tel:{' '}
          <code className="text-blue-300 font-bold">05443127760</code>
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Başvuru Numaranız *
            </label>
            <input
              type="text"
              required
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="Örn: G2T-AL-2026-1042"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kayıtlı Telefon Numaranız *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
        >
          {loading ? 'Sorgulanıyor...' : 'Başvuru Durumunu Sorgula'}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600">
                {result.type === 'BUYER_REQUEST'
                  ? 'Özel Alıcı Talebi'
                  : 'Özel Satıcı Teklifi'}{' '}
                • {result.category}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {result.referenceNo}
              </h2>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
              Aşama {result.stageStep}/13: {result.stageLabel}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-xs font-bold text-slate-900">
              Güncel İşlem Durumu: {result.stageLabel}
            </div>
            <p className="text-xs text-slate-600">{result.stageDescription}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {TRANSACTION_STAGES.slice(0, 13).map((st) => {
              const done = st.step <= result.stageStep;
              return (
                <div
                  key={st.key}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    done
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-bold'
                      : 'bg-slate-50 border-slate-200/60 text-slate-400'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      done ? 'text-emerald-600' : 'text-slate-300'
                    }`}
                  />
                  <span className="truncate">
                    {st.step}. {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Gizlilik gereği eşleşen karşı tarafın kimlik ve iletişim bilgileri paylaşılmaz; tüm süreç Go2Tek tarafından yürütülür.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
