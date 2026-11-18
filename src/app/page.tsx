import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import { HeroSlider } from '@/components/home/HeroSlider';
import { AboutSection } from '@/components/home/AboutSection';
import { getHeroSlides, getSiteSettings } from '@/lib/site-config';
import { getPublishedProducts } from '@/lib/store-queries';
import {
  Sparkles,
  Tag,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  Cpu,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredProducts, heroSlides, siteSettings] = await Promise.all([
    getPublishedProducts({ take: 8 }),
    getHeroSlides(),
    getSiteSettings(),
  ]);

  const quickCategories = [
    { label: '2.El Notebook', slug: 'notebook', icon: Laptop },
    { label: 'Masaüstü PC', slug: 'masaustu-bilgisayar', icon: Monitor },
    { label: '2.El Telefon', slug: 'telefon', icon: Smartphone },
    { label: '2.El Tablet', slug: 'tablet', icon: Tablet },
    { label: 'Monitör', slug: 'monitor', icon: Monitor },
    { label: 'PC Parçaları', slug: 'bilgisayar-parcalari', icon: Cpu },
    { label: 'Çevre Birimleri', slug: 'cevre-birimleri', icon: Headphones },
    { label: 'Diğer Elektronik', slug: 'diger-elektronik', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-14 pb-12">
      {/* 1. Clean Hero Slider */}
      <HeroSlider initialSlides={heroSlides} />

      {/* 2. Simple 3-Option Guide ("Ne Yapmak İstersiniz?") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Mağazadan Satın Al */}
          <Link
            href="/magaza"
            className="group bg-white rounded-2xl border border-zinc-200/90 hover:border-red-500 p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-zinc-900 group-hover:text-red-600 transition">
                1. Mağazadan Doğrudan Satın Al
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Go2Tek stoklarındaki genel kontrolleri yapılmış, temiz ve bakımlı bilgisayar, telefon ve tabletleri hemen inceleyin.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
              Ürünleri İncele <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 2: Bütçeme Göre Cihaz Bul */}
          <Link
            href="/butceme-gore-cihaz-bul"
            className="group bg-white rounded-2xl border border-zinc-200/90 hover:border-red-500 p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-zinc-900 group-hover:text-red-600 transition">
                2. Bütçeme Göre Cihaz Bul
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Aradığınız özellikleri ve bütçenizi yazın. İlan yayınlanmadan, satıcı portföyümüzden uygun cihazı bulup size sunalım.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
              Özel Alım Talebi Oluştur <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 3: Cihazımı Satmak İstiyorum */}
          <Link
            href="/cihazimi-satmak-istiyorum"
            className="group bg-white rounded-2xl border border-zinc-200/90 hover:border-red-500 p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-zinc-900 group-hover:text-red-600 transition">
                3. Cihazımı Satmak İstiyorum
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Cihazınızın özelliklerini ve istediğiniz fiyatı gönderin. Açık ilanlarla uğraşmadan Go2Tek aracılığıyla güvenle satın.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
              Satış Teklifi Gönder <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* 3. Clean Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
            Kategoriler
          </h2>
          <Link
            href="/magaza"
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/magaza/${cat.slug}`}
                className="bg-white hover:bg-red-50/50 border border-zinc-200/80 hover:border-red-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-zinc-800">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Store Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
              Vitrin Ürünleri
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Genel kontrolleri yapılmış, temiz ve hemen teslime hazır mağaza stoklarımız
            </p>
          </div>
          <Link
            href="/magaza"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Tüm Mağaza Ürünlerini İncele ({featuredProducts.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4.5. About Go2Tek (Bartın Story & Store Portrait) */}
      <AboutSection />

      {/* 5. Clean, Realistic Info Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-red-100 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Go2Tek Güvenli Alım - Satım Süreci
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold">
              {siteSettings.bannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-red-50 leading-relaxed">
              {siteSettings.bannerDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/butceme-gore-cihaz-bul"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-red-50 text-red-600 text-xs font-bold transition shadow-sm"
            >
              Bütçeme Göre Cihaz Bul
            </Link>
            <Link
              href="/hakkimizda"
              className="px-6 py-3.5 rounded-full bg-red-800/50 hover:bg-red-800 text-white border border-red-400/40 text-xs font-bold transition"
            >
              Hakkımızda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
