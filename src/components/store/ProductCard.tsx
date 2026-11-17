'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, CheckCircle2, MessageCircle } from 'lucide-react';
import { COSMETIC_LABELS, PRODUCT_CATEGORIES } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import { usePublicSettings } from '@/context/SettingsContext';

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
  const { addToCart, items } = useCart();
  const { whatsappNumber } = usePublicSettings();

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

  const inCart = items.some((x) => x.id === product.id);

  const whatsappText = encodeURIComponent(
    `Merhaba Go2Tek, "${product.title}" (Kod: ${product.sku} - Fiyat: ${product.price.toLocaleString(
      'tr-TR'
    )} TL) ürünü hakkında bilgi almak / satın almak istiyorum.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/90 hover:border-zinc-300 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Clean Studio Image */}
      <Link
        href={`/urun/${product.slug}`}
        className="relative aspect-[4/3] bg-zinc-100 overflow-hidden block"
      >
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-zinc-800 text-[11px] font-semibold shadow-2xs">
            {categoryMeta?.shortLabel || product.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-semibold shadow-2xs">
            Kozmetik {cosmeticText}
          </span>
        </div>
      </Link>

      {/* Clean Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span className="text-red-600 font-semibold">{product.brand}</span>
            <span className="inline-flex items-center gap-1 text-zinc-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Kontrol Edilmiş
            </span>
          </div>

          <Link
            href={`/urun/${product.slug}`}
            className="block font-bold text-zinc-900 group-hover:text-red-600 transition line-clamp-2 text-sm sm:text-[15px] leading-snug"
          >
            {product.title}
          </Link>

          <p className="text-xs text-zinc-500 line-clamp-1 pt-0.5">
            {product.cpu} •{' '}
            {product.ram !== '-' ? `${product.ram} • ${product.storage}` : product.gpu}
          </p>
        </div>

        {/* Clean Price & WhatsApp + Cart Action Row */}
        <div className="pt-3 border-t border-zinc-100 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="block text-[11px] text-zinc-400">Satış Fiyatı</span>
              <span className="text-lg font-extrabold text-zinc-900">
                {product.price.toLocaleString('tr-TR')}{' '}
                <span className="text-xs font-bold text-red-600">TL</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* WhatsApp Circular Icon Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white flex items-center justify-center shadow-xs transition"
                title="WhatsApp ile Sor / Sipariş Ver"
                aria-label="WhatsApp ile Sor"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
              </a>

              {/* Add to Cart Circular Icon Button */}
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    slug: product.slug,
                    sku: product.sku,
                    title: product.title,
                    brand: product.brand,
                    price: product.price,
                    image: imageSrc,
                    cosmeticCondition: product.cosmeticCondition,
                  })
                }
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition ${
                  inCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title={inCart ? 'Sepette' : 'Sepete Ekle'}
                aria-label="Sepete Ekle"
              >
                {inCart ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
