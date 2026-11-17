import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, HardDrive, BatteryCharging, ArrowRight } from 'lucide-react';
import { COSMETIC_LABELS, PRODUCT_CATEGORIES } from '@/lib/constants';

export interface StoreProductItem {
  id: string;
  slug: string;
  sku: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screenSize: string;
  cosmeticCondition: string;
  batteryHealth: string;
  images: string;
  price: number;
  stockStatus: string;
  warrantyInfo: string;
}

export function ProductCard({ product }: { product: StoreProductItem }) {
  let imageSrc = '/images/products/macbook-pro-14.svg';
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      imageSrc = parsed[0];
    }
  } catch {
    // fallback
  }

  const categoryMeta = PRODUCT_CATEGORIES.find((c) => c.key === product.category);
  const cosmeticText =
    COSMETIC_LABELS[product.cosmeticCondition]?.split(' ')[0] ||
    product.cosmeticCondition;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500/60 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden">
      {/* Image Header */}
      <Link
        href={`/urun/${product.slug}`}
        className="relative aspect-[16/11] bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center p-4"
      >
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-bold tracking-wide">
            {categoryMeta?.shortLabel || product.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold">
            Kozmetik: {cosmeticText}
          </span>
        </div>
        <div className="absolute bottom-2.5 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            14 Test Onaylı
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{product.brand}</span>
            <span>Stok Kodu: {product.sku}</span>
          </div>
          <Link
            href={`/urun/${product.slug}`}
            className="block font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 text-base leading-snug"
          >
            {product.title}
          </Link>

          {/* Technical Pill Specs */}
          <div className="pt-2 grid grid-cols-2 gap-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg truncate">
              <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{product.cpu}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg truncate">
              <HardDrive className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                {product.ram !== '-' ? `${product.ram} / ${product.storage}` : product.gpu}
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg truncate">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                Pil / Güç: {product.batteryHealth} • {product.screenSize}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Price & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">
              Go2Tek Garantili Fiyat
            </span>
            <span className="text-xl font-black text-slate-900">
              {product.price.toLocaleString('tr-TR')}{' '}
              <span className="text-sm font-bold text-blue-600">TL</span>
            </span>
          </div>
          <Link
            href={`/urun/${product.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-bold transition"
          >
            İncele
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
