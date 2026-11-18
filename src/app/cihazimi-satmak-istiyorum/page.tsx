'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCT_CATEGORIES, COSMETIC_LABELS } from '@/lib/constants';
import { uploadMediaFile } from '@/lib/client-upload';
import {
  Tag,
  Lock,
  CheckCircle2,
  Upload,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function SellerOfferPage() {
  const [category, setCategory] = useState('NOTEBOOK');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('16 GB');
  const [ramGb, setRamGb] = useState('16');
  const [storage, setStorage] = useState('512 GB NVMe SSD');
  const [storageGb, setStorageGb] = useState('512');
  const [gpu, setGpu] = useState('');
  const [screenSize, setScreenSize] = useState('15.6"');
  const [cosmeticCondition, setCosmeticCondition] = useState('A');
  const [batteryHealth, setBatteryHealth] = useState('%92');
  const [knownDefects, setKnownDefects] = useState('Bilinen herhangi bir arızası yoktur.');
  const [photos, setPhotos] = useState<string[]>([
    '/images/products/macbook-pro-14.svg',
  ]);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [requestedPrice, setRequestedPrice] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(''); // Honeypot

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<{
    referenceNo: string;
    message: string;
  } | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setError('');
    try {
      const result = await uploadMediaFile(file, 'image');
      if (!result.ok || !result.url) {
        setError(result.error || 'Fotoğraf yüklenemedi.');
      } else {
        setPhotos((prev) => [result.url!, ...prev]);
      }
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setError('');
    try {
      const result = await uploadMediaFile(file, 'video');
      if (!result.ok || !result.url) {
        setError(result.error || 'Video yüklenemedi.');
      } else {
        setVideoUrl(result.url);
      }
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/requests/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          brand,
          model,
          serialNumber,
          cpu,
          ram,
          ramGb: Number(ramGb),
          storage,
          storageGb: Number(storageGb),
          gpu,
          screenSize,
          cosmeticCondition,
          batteryHealth,
          knownDefects,
          photos,
          videoUrl,
          requestedPrice: Number(requestedPrice),
          fullName,
          phone,
          description,
          contactConsent,
          kvkkConsent,
          websiteUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Teklif kaydedilirken bir hata oluştu.');
      } else {
        setSubmittedRef({
          referenceNo: data.referenceNo,
          message: data.message,
        });
      }
    } catch {
      setError('Sunucu bağlantı hatası oluştu.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="bg-zinc-900 text-white rounded-3xl p-8 space-y-3 border-b-4 border-red-600">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold">
          <Tag className="w-4 h-4" />
          Go2Tek Özel Satıcı Teklif Sistemi
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Cihazımı Satmak İstiyorum
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Satmak istediğiniz cihazın teknik özelliklerini, kozmetik durumunu, fotoğraflarını ve istediğiniz satış fiyatını girin.{' '}
          <strong className="text-white">
            Teklifiniz herkese açık ilan olarak yayınlanmaz ve seri numaranız/telefonunuz üçüncü kişilerle paylaşılmaz.
          </strong>{' '}
          Go2Tek yöneticileri cihazınızı kapalı devre alıcı talepleriyle veya mağaza alım kriterleriyle eşleştirerek sizinle iletişime geçer.
        </p>
      </div>

      {submittedRef ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-8 text-center space-y-5 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Özel Satıcı Teklifiniz Kaydedildi
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
            Başvuru durumunuzu dilediğiniz zaman{' '}
            <Link
              href="/basvuru-sorgula"
              className="text-blue-600 font-bold underline"
            >
              Başvuru Sorgulama
            </Link>{' '}
            sayfasından takip edebilirsiniz.
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs"
        >
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

          {/* Section 1: Cihaz Kimliği & Donanım */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              1. Cihaz Kimliği ve Teknik Özellikler
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
                  Marka *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Örn: Apple, ASUS, MSI, Lenovo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Model *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Örn: MacBook Pro 14 M2 / ROG Strix G16"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Seri Numarası (Gizli Tutulur - Yalnız Teknik Kontrol İçin)
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Cihaz seri no (Müşterilere kesinlikle gösterilmez)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  İşlemci (CPU) *
                </label>
                <input
                  type="text"
                  required
                  value={cpu}
                  onChange={(e) => setCpu(e.target.value)}
                  placeholder="Örn: Apple M2 Pro / Intel Core i7-13650HX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  RAM Kapasitesi *
                </label>
                <select
                  value={ramGb}
                  onChange={(e) => {
                    setRamGb(e.target.value);
                    setRam(`${e.target.value} GB`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="8">8 GB RAM</option>
                  <option value="16">16 GB RAM</option>
                  <option value="32">32 GB RAM</option>
                  <option value="64">64 GB RAM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Depolama (SSD/HDD) *
                </label>
                <select
                  value={storageGb}
                  onChange={(e) => {
                    setStorageGb(e.target.value);
                    setStorage(`${e.target.value} GB NVMe SSD`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="256">256 GB SSD</option>
                  <option value="512">512 GB SSD</option>
                  <option value="1024">1 TB SSD</option>
                  <option value="2048">2 TB SSD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ekran Kartı (GPU)
                </label>
                <input
                  type="text"
                  value={gpu}
                  onChange={(e) => setGpu(e.target.value)}
                  placeholder="Örn: RTX 4060 8GB / Apple 16-Core GPU"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ekran Boyutu
                </label>
                <input
                  type="text"
                  value={screenSize}
                  onChange={(e) => setScreenSize(e.target.value)}
                  placeholder="Örn: 14.2 inç / 15.6 inç 144Hz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kozmetik Durum *
                </label>
                <select
                  value={cosmeticCondition}
                  onChange={(e) => setCosmeticCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="A_PLUS">{COSMETIC_LABELS.A_PLUS}</option>
                  <option value="A">{COSMETIC_LABELS.A}</option>
                  <option value="B">{COSMETIC_LABELS.B}</option>
                  <option value="C">{COSMETIC_LABELS.C}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pil Sağlığı / Güç Durumu
                </label>
                <input
                  type="text"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="Örn: %94 (65 Döngü)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-700 mb-1.5">
                  İstediğiniz Satış Fiyatı (TL) *
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  value={requestedPrice}
                  onChange={(e) => setRequestedPrice(e.target.value)}
                  placeholder="Örn: 35500"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-blue-500/50 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bilinen Arızalar / Kusurlar *
              </label>
              <input
                type="text"
                required
                value={knownDefects}
                onChange={(e) => setKnownDefects(e.target.value)}
                placeholder="Varsa çalışmayan aksam, piksel, menteşe veya kozmetik kusurları şeffafça belirtin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ek Açıklama (Kutu, Fatura, Garanti Durumu)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kutu, orijinal şarj aleti ve devam eden garanti bilgilerini paylaşabilirsiniz..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Section 2: Güvenli Fotoğraf Yükleme */}
          <div className="space-y-3">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              2. Cihazın Fotoğrafları (Güvenli Yükleme)
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>
                  {uploadingPhoto
                    ? 'Yükleniyor...'
                    : 'Cihaz Fotoğrafı Yükle (JPG, PNG, WEBP - Maks 5MB)'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-500">
                Yüklenen fotoğraflar yalnız Go2Tek uzmanları tarafından görüntülenir.
              </span>
            </div>
            {photos.length > 0 && (
              <div className="flex gap-3 pt-2">
                {photos.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-20 rounded-xl border border-slate-200 bg-slate-50 p-1.5 flex items-center justify-center"
                  >
                    <img
                      src={src}
                      alt="Cihaz önizleme"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Cihaz Videosu (Opsiyonel — MP4/WEBM/MOV yükleyin veya video bağlantısı girin)
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition shrink-0">
                  <Upload className="w-4 h-4 text-red-600" />
                  <span>
                    {uploadingVideo
                      ? 'Video Yükleniyor...'
                      : 'Video Yükle (MP4, WEBM, MOV)'}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="veya YouTube / Video bağlantısı yapıştırın..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              {videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be') && (
                <video
                  src={videoUrl}
                  controls
                  className="h-32 rounded-xl border border-slate-200 bg-black mt-2"
                />
              )}
            </div>
          </div>

          {/* Section 3: İletişim & İzinler */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              3. Satıcı İletişim Bilgileri ve Veri İşleme İzinleri
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
                  <strong>İletişim İzni:</strong> Cihaz teklifimin değerlendirilmesi ve alıcı eşleştirmesi için Go2Tek yetkililerinin benimle iletişime geçmesini onaylıyorum. *
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
                  <strong>KVKK ve Veri İşleme İzni:</strong> Seri numarası ve iletişim bilgilerimin herkese açık yayınlanmadan yalnızca Go2Tek yönetim ve teknik kontrol süreçlerinde işlenmesini kabul ediyorum. *
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
              <span>Teklifiniz herkese açık ilan olarak yayınlanmaz.</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-600/25 transition disabled:opacity-50"
            >
              {submitting ? 'Gönderiliyor...' : 'Özel Satıcı Teklifini Gönder'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
