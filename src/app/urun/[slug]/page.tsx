import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedProductBySlug } from '@/lib/store-queries';
import {
  COSMETIC_LABELS,
  INSPECTION_CRITERIA,
  PRODUCT_CATEGORIES,
} from '@/lib/constants';
import { ProductOrderForm } from '@/components/store/ProductOrderForm';
import { ProductMediaGallery } from '@/components/store/ProductMediaGallery';
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

  const product = await getPublishedProductBySlug(slug);

  if (!product) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold">
        <Link
          href="/magaza"
          className="inline-flex items-center gap-1 text-zinc-800 hover:text-red-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Mağaza
        </Link>
        <span>/</span>
        {categoryMeta && (
          <>
            <Link
              href={`/magaza/${categoryMeta.slug}`}
              className="hover:text-red-600"
            >
              {categoryMeta.label}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-900 truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Gallery (Images + Device Video) */}
        <div className="lg:col-span-6 space-y-4">
          <ProductMediaGallery
            images={images}
            videoUrl={product.videoUrl}
            title={product.title}
            sku={product.sku}
            stockStatus={product.stockStatus}
          />

          {/* Technical Inspection Summary Card */}
          <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5 space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Cihaz Kontrol ve Kondisyon Bilgisi
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              {product.technicalCheckSummary}
            </p>
          </div>
        </div>

        {/* Right Details & Purchase */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
                  {product.brand} • {product.model}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-extrabold">
                  Kozmetik: {cosmeticDesc}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight">
                {product.title}
              </h1>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price & Warranty Box */}
            <div className="p-5 rounded-2xl bg-zinc-900 text-white border-l-4 border-red-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">
                  KDV ve Ekspertiz Sertifikası Dahil Mağaza Fiyatı
                </span>
                <span className="text-3xl font-black text-white">
                  {product.price.toLocaleString('tr-TR')}{' '}
                  <span className="text-lg text-red-500">TL</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-zinc-800 px-3.5 py-2 rounded-xl border border-zinc-700 font-bold">
                <Award className="w-4 h-4 shrink-0" />
                <span>{product.warrantyInfo}</span>
              </div>
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-500 block">İşlemci (CPU)</span>
                  <strong className="text-zinc-900">{product.cpu}</strong>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-500 block">RAM & Depolama (SSD/HDD)</span>
                  <strong className="text-zinc-900">
                    {product.ram} / {product.storage}
                  </strong>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
                <Monitor className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-500 block">Ekran Kartı & Ekran Boyutu</span>
                  <strong className="text-zinc-900">
                    {product.gpu} • {product.screenSize}
                  </strong>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
                <BatteryCharging className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-500 block">Pil Sağlığı & Kondisyon</span>
                  <strong className="text-zinc-900">
                    {product.batteryHealth} ({cosmeticDesc})
                  </strong>
                </div>
              </div>
            </div>

            {/* Purchase & Cart Component */}
            <ProductOrderForm
              productId={product.id}
              productSlug={product.slug}
              productSku={product.sku}
              productBrand={product.brand}
              productTitle={product.title}
              productImage={images[0]}
              cosmeticCondition={product.cosmeticCondition}
              price={product.price}
            />
          </div>
        </div>
      </div>

      {/* General Checklist Section */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              Genel Cihaz Kontrol Noktaları
            </h2>
            <p className="text-xs text-zinc-500">
              Cihazın mağaza stoğuna alınırken incelenen temel donanım ve kozmetik başlıkları:
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Genel Kontrolü Yapıldı
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INSPECTION_CRITERIA.map((c) => (
            <div
              key={c.field}
              className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between text-xs"
            >
              <span className="font-bold text-zinc-800">{c.label}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                GEÇTİ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
