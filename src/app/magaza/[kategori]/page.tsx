import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { ProductCard } from '@/components/store/ProductCard';
import { ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CategoryStorePage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;

  const matchedCat = PRODUCT_CATEGORIES.find((c) => c.slug === kategori);

  // If slug is "diger-elektronik", also show MONITOR, PHONE, PARTS, PERIPHERALS, OTHER so visitors see all auxiliary electronics
  const categoriesFilter =
    kategori === 'diger-elektronik'
      ? ['MONITOR', 'PHONE', 'PARTS', 'PERIPHERALS', 'OTHER']
      : matchedCat
      ? [matchedCat.key]
      : ['NOTEBOOK'];

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      category: { in: categoriesFilter },
    },
    orderBy: { createdAt: 'desc' },
  });

  const pageTitle = matchedCat ? matchedCat.label : 'Kategori Ürünleri';
  const pageDesc = matchedCat
    ? matchedCat.description
    : 'Go2Tek 14 Noktalı Teknik Kontrol Onaylı Ürünler';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/magaza"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Tüm Mağaza Kategorilerine Dön
        </Link>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase">
            <ShieldCheck className="w-4 h-4" />
            Go2Tek Mağaza • Ekspertiz Onaylı
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{pageTitle}</h1>
          <p className="text-sm text-slate-300">{pageDesc}</p>
        </div>
        <Link
          href="/butceme-gore-cihaz-bul"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Özel {matchedCat?.shortLabel || 'Cihaz'} Talebi Oluştur
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="font-bold text-slate-800">
            Bu kategoride şu an hazır stok bulunmuyor.
          </p>
          <Link
            href="/butceme-gore-cihaz-bul"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
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
