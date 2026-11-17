import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  COSMETIC_LABELS,
  INSPECTION_CRITERIA,
  PRODUCT_CATEGORIES,
} from '@/lib/constants';
import { ProductOrderForm } from '@/components/store/ProductOrderForm';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  HardDrive,
  Monitor,
  BatteryCharging,
  Award,
  ArrowLeft,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  let images: string[] = ['/images/products/macbook-pro-14.svg'];
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      images = parsed;
    }
  } catch {
    // fallback
  }

  const categoryMeta = PRODUCT_CATEGORIES.find((c) => c.key === product.category);
  const cosmeticDesc =
    COSMETIC_LABELS[product.cosmeticCondition] || product.cosmeticCondition;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link
          href="/magaza"
          className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-600 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Mağaza
        </Link>
        <span>/</span>
        {categoryMeta && (
          <>
            <Link
              href={`/magaza/${categoryMeta.slug}`}
              className="hover:text-blue-600"
            >
              {categoryMeta.label}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 aspect-[16/11] flex items-center justify-center relative overflow-hidden">
            <img
              src={images[0]}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                Stok Kodu: {product.sku}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                {product.stockStatus === 'IN_STOCK' ? 'Stokta Hazır' : 'Rezerve'}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-2 aspect-video flex items-center justify-center"
                >
                  <img
                    src={img}
                    alt={`${product.title} - ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Technical Inspection Summary Card */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Go2Tek Teknik Kontrol ve Ekspertiz Özeti
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {product.technicalCheckSummary}
            </p>
          </div>
        </div>

        {/* Right Details & Purchase */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {product.brand} • {product.model}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                  Kozmetik: {cosmeticDesc}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.title}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price & Warranty Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">
                  KDV ve Ekspertiz Sertifikası Dahil Satış Fiyatı
                </span>
                <span className="text-3xl font-black text-white">
                  {product.price.toLocaleString('tr-TR')}{' '}
                  <span className="text-lg text-blue-400">TL</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
                <Award className="w-4 h-4 shrink-0" />
                <span>{product.warrantyInfo}</span>
              </div>
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">İşlemci (CPU)</span>
                  <strong className="text-slate-900">{product.cpu}</strong>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">RAM & Depolama (SSD/HDD)</span>
                  <strong className="text-slate-900">
                    {product.ram} / {product.storage}
                  </strong>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <Monitor className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Ekran Kartı & Ekran Boyutu</span>
                  <strong className="text-slate-900">
                    {product.gpu} • {product.screenSize}
                  </strong>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <BatteryCharging className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Pil Sağlığı & Kondisyon</span>
                  <strong className="text-slate-900">
                    {product.batteryHealth} ({cosmeticDesc})
                  </strong>
                </div>
              </div>
            </div>

            {/* Purchase & Order Component */}
            <ProductOrderForm
              productId={product.id}
              productTitle={product.title}
              price={product.price}
            />
          </div>
        </div>
      </div>

      {/* 14-Point Checklist Verification Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              14 Noktalı Go2Tek Teknik Kontrol Sonuçları
            </h2>
            <p className="text-xs text-slate-500">
              Bu cihaz mağaza stoğuna alınmadan önce aşağıdaki 14 donanım ve kozmetik testten başarıyla geçmiştir.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            14/14 Test Onaylı
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INSPECTION_CRITERIA.map((c) => (
            <div
              key={c.field}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
            >
              <span className="font-semibold text-slate-800">{c.label}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                GEÇTİ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
