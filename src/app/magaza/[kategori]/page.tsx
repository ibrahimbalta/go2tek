import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { ProductCard } from '@/components/store/ProductCard';
import { getPublishedProducts } from '@/lib/store-queries';
import { ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const matchedCat = PRODUCT_CATEGORIES.find((c) => c.slug === kategori);
  const title = matchedCat
    ? `${matchedCat.label} Fiyatları ve Modelleri`
    : 'Mağaza Ürünleri';
  const description = matchedCat
    ? `Bartın Go2Tek 2.El Teknoloji Mağazası: ${matchedCat.description}`
    : 'Bartın Go2Tek 2.El Teknoloji Mağazası kontrol edilmiş ikinci el ürünler.';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Go2Tek Bartın`,
      description,
      images: ['/images/go2tek-hakkimizda.jpg'],
    },
  };
}

export default async function CategoryStorePage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;

  const matchedCat = PRODUCT_CATEGORIES.find((c) => c.slug === kategori);

  const categoriesFilter =
    kategori === 'diger-elektronik'
      ? ['MONITOR', 'PARTS', 'PERIPHERALS', 'OTHER']
      : matchedCat
      ? [matchedCat.key]
      : ['NOTEBOOK'];

  const products = await getPublishedProducts({
    categories: categoriesFilter,
  });

  const pageTitle = matchedCat ? matchedCat.label : 'Kategori Ürünleri';
  const pageDesc = matchedCat
    ? matchedCat.description
    : 'Go2Tek 14 Noktalı Teknik Kontrol Onaylı Ürünler';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/magaza"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-zinc-700 hover:text-red-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Tüm Mağaza Kategorilerine Dön
        </Link>
      </div>

      <div className="bg-zinc-900 text-white rounded-3xl p-8 border-b-4 border-red-600 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-500 uppercase">
            <ShieldCheck className="w-4 h-4" />
            Go2Tek 2.El Teknoloji Mağazası • Ekspertiz Onaylı
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{pageTitle}</h1>
          <p className="text-sm text-zinc-300">{pageDesc}</p>
        </div>
        <Link
          href="/butceme-gore-cihaz-bul"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Özel {matchedCat?.shortLabel || 'Cihaz'} Talebi Oluştur
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-zinc-200 p-12 text-center space-y-3">
          <p className="font-bold text-zinc-800">
            Bu kategoride şu an hazır stok bulunmuyor.
          </p>
          <Link
            href="/butceme-gore-cihaz-bul"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
          >
            Bütçeme Göre Cihaz Bul
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
