'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCT_CATEGORIES, COSMETIC_LABELS } from '@/lib/constants';
import {
  Sparkles,
  Lock,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function BuyerRequestPage() {
  const [category, setCategory] = useState('NOTEBOOK');
  const [brandPref, setBrandPref] = useState('');
  const [cpuPref, setCpuPref] = useState('');
  const [ramPref, setRamPref] = useState('16 GB');
  const [minRamGb, setMinRamGb] = useState('16');
  const [storagePref, setStoragePref] = useState('512 GB NVMe SSD');
  const [minStorageGb, setMinStorageGb] = useState('512');
  const [gpuPref, setGpuPref] = useState('');
  const [screenSizePref, setScreenSizePref] = useState('14" - 15.6"');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [cosmeticPref, setCosmeticPref] = useState('A');
  const [usagePurpose, setUsagePurpose] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(''); // Honeypot

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<{
    referenceNo: string;
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/requests/buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          brandPref,
          cpuPref,
          ramPref,
          minRamGb: Number(minRamGb),
          storagePref,
          minStorageGb: Number(minStorageGb),
          gpuPref,
          screenSizePref,
          minBudget: Number(minBudget),
          maxBudget: Number(maxBudget),
          cosmeticPref,
          usagePurpose,
          additionalNotes,
          fullName,
          phone,
          contactConsent,
          kvkkConsent,
          websiteUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Başvuru oluşturulurken bir hata meydana geldi.');
      } else {
        setSubmittedRef({
          referenceNo: data.referenceNo,
          message: data.message,
        });
      }
    } catch {
      setError('Sunucu ile bağlantı kurulamadı.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          Go2Tek Özel Alıcı Talep Sistemi
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Bütçeme Göre Cihaz Bul
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Aradığınız ikinci el teknolojik cihazın özelliklerini ve bütçe aralığınızı girin.{' '}
          <strong className="text-white">
            Başvurunuz kesinlikle herkese açık bir ilan olarak yayınlanmaz;
          </strong>{' '}
          yalnızca Go2Tek Yönetim Panelinde incelenerek uygun satıcı cihazlarıyla eşleştirilir ve 14 noktalı teknik kontrol sonrasında size sunulur.
        </p>
      </div>

      {submittedRef ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-8 text-center space-y-5 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Özel Alım Talebiniz Alındı
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Başvuru Numaranız:{' '}
              <span className="text-blue-600 select-all">
                {submittedRef.referenceNo}
              </span>
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              {submittedRef.message}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs text-slate-600">
            Lütfen başvuru numaranızı kaydedin. Sürecinizi dilediğiniz zaman{' '}
            <Link
              href="/basvuru-sorgula"
              className="text-blue-600 font-bold underline"
            >
              Başvuru Sorgulama
            </Link>{' '}
            ekranından takip edebilirsiniz.
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Cihaz & Teknik Kriterler */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              1. İstediğiniz Cihazın Teknik Özellikleri
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ürün Kategorisi *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Marka Tercihi
                </label>
                <input
                  type="text"
                  value={brandPref}
                  onChange={(e) => setBrandPref(e.target.value)}
                  placeholder="Örn: Apple, ASUS, Lenovo veya Farketmez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  İşlemci (CPU) Tercihi
                </label>
                <input
                  type="text"
                  value={cpuPref}
                  onChange={(e) => setCpuPref(e.target.value)}
                  placeholder="Örn: Apple M2/M3, Intel i7 13. Nesil, Ryzen 7"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  RAM Kapasitesi Tercihi
                </label>
                <select
                  value={minRamGb}
                  onChange={(e) => {
                    setMinRamGb(e.target.value);
                    setRamPref(`${e.target.value} GB`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="8">En az 8 GB RAM</option>
                  <option value="16">En az 16 GB RAM</option>
                  <option value="32">En az 32 GB RAM</option>
                  <option value="64">64 GB ve üzeri RAM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Depolama (SSD/HDD) Tercihi
                </label>
                <select
                  value={minStorageGb}
                  onChange={(e) => {
                    setMinStorageGb(e.target.value);
                    setStoragePref(`${e.target.value} GB SSD`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="256">En az 256 GB NVMe SSD</option>
                  <option value="512">En az 512 GB NVMe SSD</option>
                  <option value="1024">En az 1 TB NVMe SSD</option>
                  <option value="2048">2 TB ve üzeri Depolama</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ekran Kartı (GPU) Tercihi
                </label>
                <input
                  type="text"
                  value={gpuPref}
                  onChange={(e) => setGpuPref(e.target.value)}
                  placeholder="Örn: RTX 4060, Apple GPU veya Dahili"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ekran Boyutu Tercihi
                </label>
                <input
                  type="text"
                  value={screenSizePref}
                  onChange={(e) => setScreenSizePref(e.target.value)}
                  placeholder="Örn: 13.6 inç, 15.6 inç, 16 inç"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kozmetik Durum Tercihi
                </label>
                <select
                  value={cosmeticPref}
                  onChange={(e) => setCosmeticPref(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="A_PLUS">{COSMETIC_LABELS.A_PLUS}</option>
                  <option value="A">{COSMETIC_LABELS.A}</option>
                  <option value="B">{COSMETIC_LABELS.B}</option>
                  <option value="ANY">{COSMETIC_LABELS.ANY}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Bütçe & Kullanım Amacı */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              2. Bütçe Aralığı ve Kullanım Amacı
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Bütçe (TL) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  placeholder="Örn: 30000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Maksimum Bütçe (TL) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="Örn: 42000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kullanım Amacı *
              </label>
              <input
                type="text"
                required
                value={usagePurpose}
                onChange={(e) => setUsagePurpose(e.target.value)}
                placeholder="Örn: Yazılım geliştirme, Mimari 3D Render, Oyun, Üniversite / Ofis"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ek Açıklama ve Özel Beklentileriniz
              </label>
              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Pil sağlığı beklentiniz, garanti tercihiniz veya belirtmek istediğiniz diğer detaylar..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Section 3: İletişim & Gizlilik */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              3. İletişim Bilgileri (Gizli Tutulur)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Adınız Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Telefon Numaranız *
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

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactConsent}
                  onChange={(e) => setContactConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600"
                />
                <span>
                  <strong>İletişim İzni:</strong> Talebime uygun cihaz bulunduğunda Go2Tek uzmanlarının telefonla benimle iletişime geçmesini onaylıyorum. *
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kvkkConsent}
                  onChange={(e) => setKvkkConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600"
                />
                <span>
                  <strong>KVKK ve Gizlilik Onayı:</strong> Kişisel verilerimin satıcılarla paylaşılmadan yalnızca Go2Tek eşleştirme sürecinde işlenmesine ilişkin{' '}
                  <Link
                    href="/gizlilik-ve-kvkk"
                    className="text-blue-600 underline font-semibold"
                  >
                    KVKK Aydınlatma Metnini
                  </Link>{' '}
                  okudum ve kabul ediyorum. *
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Bu talep herkese açık yayınlanmaz, yalnız Go2Tek yönetim paneline düşer.</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
            >
              {submitting ? 'Gönderiliyor...' : 'Özel Alıcı Talebini Oluştur'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
