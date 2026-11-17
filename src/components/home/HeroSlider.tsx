'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Flame,
} from 'lucide-react';

interface SlideItem {
  id: string;
  tabTitle: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  features: string[];
  featuredCard: {
    tag: string;
    name: string;
    specs: string;
    price: string;
    oldPrice?: string;
    href: string;
  };
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const SLIDES: SlideItem[] = [
  {
    id: 'vitrin-notebook',
    tabTitle: 'Notebook & MacBook Fırsatları',
    badge: 'GO2TEK MAĞAZA VİTRİNİ',
    titlePrefix: 'Temiz ve Bakımlı ',
    titleHighlight: '2.El MacBook & Notebook',
    titleSuffix: ' Fırsatları',
    description:
      'Go2Tek mağazamızdaki ikinci el bilgisayarlar genel çalışma kontrolleri yapılarak, kozmetik durumu ve cihaz özellikleri şeffaf biçimde belirtilerek satışa sunulur.',
    features: [
      'Genel Çalışma Kontrolleri Yapılmış Cihazlar',
      'Şeffaf Kozmetik ve Pil Durumu Bilgisi',
      'Hızlı Kargo veya Mağazadan Görerek Teslim',
    ],
    featuredCard: {
      tag: 'Haftanın Vitrin Ürünü • Temiz Cihaz',
      name: 'Apple MacBook Pro 14" M2 Pro',
      specs: '16 GB RAM • 512 GB NVMe SSD • %96 Pil',
      oldPrice: '63.500 TL',
      price: '58.900 TL',
      href: '/urun/apple-macbook-pro-14-m2-pro-16gb-512gb',
    },
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Mağaza Ürünlerini Keşfet',
      href: '/magaza',
    },
    secondaryCta: {
      label: 'Notebook Kategorisi',
      href: '/magaza/notebook',
    },
  },
  {
    id: 'butceme-gore-bul',
    tabTitle: 'Bütçeme Göre Cihaz Bul',
    badge: 'ÖZEL TALEP EŞLEŞTİRME SİSTEMİ',
    titlePrefix: 'Bütçenizi Yazın, ',
    titleHighlight: 'İstediğiniz Cihazı',
    titleSuffix: ' Sizin İçin Araştırıp Bulalım',
    description:
      'Aradığınız cihaz mağaza stoğumuzda yoksa bütçenizi ve istediğiniz özellikleri girin. Başvurunuz herkese açık ilan olmaz; satıcı portföyümüzden size uygun cihazı bulup iletişime geçeriz.',
    features: [
      'Herkese Açık İlan Yayınlanmaz (Gizli Başvuru)',
      'Bütçe ve Donanım Tercihinize Göre Eşleştirme',
      'Teslimat Öncesi Genel Cihaz Kontrolü',
    ],
    featuredCard: {
      tag: 'Özel Alıcı Talep Sistemi',
      name: 'Bütçenize Uygun Cihaz Araştırması',
      specs: 'Notebook • Masaüstü PC • Tablet • Telefon',
      price: 'Bütçenize Özel Teklif',
      href: '/butceme-gore-cihaz-bul',
    },
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Bütçeme Göre Cihaz Bul',
      href: '/butceme-gore-cihaz-bul',
    },
    secondaryCta: {
      label: 'Başvuru Sorgula',
      href: '/basvuru-sorgula',
    },
  },
  {
    id: 'cihazimi-sat',
    tabTitle: 'Cihazını Değerinde Sat / Takas',
    badge: 'ALIM • SATIM • TAKAS MERKEZİ',
    titlePrefix: 'Cihazınızı Açık İlanlarla Uğraşmadan ',
    titleHighlight: 'Go2Tek Güvencesiyle',
    titleSuffix: ' Değerinde Satın',
    description:
      'Satmak istediğiniz notebook, bilgisayar, telefon veya tabletin özelliklerini ve istediğiniz fiyatı gönderin. Telefon numaranız kimseyle paylaşılmadan süreci Go2Tek yönetsin.',
    features: [
      'Kişisel Bilgileriniz & Telefonunuz Gizli Tutulur',
      'Değerinde Satış veya Takas Değerlendirmesi',
      'Hızlı Ön İnceleme ve Güvenli İşlem Süreci',
    ],
    featuredCard: {
      tag: 'Hızlı & Güvenli Satış Süreci',
      name: '2.El Bilgisayar, Telefon & Tablet Alımı',
      specs: 'Açık İlan Karmaşası Yok • Doğrudan Mağaza Süreci',
      price: 'Hemen Teklif Oluşturun',
      href: '/cihazimi-satmak-istiyorum',
    },
    image:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Cihazımı Satmak İstiyorum',
      href: '/cihazimi-satmak-istiyorum',
    },
    secondaryCta: {
      label: 'Nasıl Çalışır?',
      href: '/hakkimizda',
    },
  },
  {
    id: 'gaming-ve-mobil',
    tabTitle: 'Gaming PC, iPhone & iPad',
    badge: 'PERFORMANS & MOBİL VİTRİNİ',
    titlePrefix: 'Bakımlı ',
    titleHighlight: 'Gaming Bilgisayarlar',
    titleSuffix: ' ve Temiz iPhone / iPad Modelleri',
    description:
      'Oyun, çizim ve günlük kullanım için temiz kullanılmış RTX serisi bilgisayarlar ile Türkiye kayıtlı iPhone ve iPad modelleri uygun fiyatlarla mağazamızda.',
    features: [
      'Bakımları Yapılmış Masaüstü ve Gaming Sistemler',
      'BTK Kayıtlı, Temiz Kullanılmış Telefon ve Tabletler',
      'Şeffaf Fiyatlandırma ve Kolay Sipariş',
    ],
    featuredCard: {
      tag: 'Gaming & Performans Serisi',
      name: 'ASUS ROG Strix G16 RTX 4060',
      specs: 'i7-13650HX • 32 GB DDR5 • 1 TB NVMe SSD • 165Hz',
      oldPrice: '51.500 TL',
      price: '47.500 TL',
      href: '/urun/asus-rog-strix-g16-i7-13650hx-32gb-1tb-rtx4060',
    },
    image:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Gaming & PC Stoklarını Gör',
      href: '/magaza/masaustu-bilgisayar',
    },
    secondaryCta: {
      label: 'Telefon & Tabletleri Gör',
      href: '/magaza/tablet',
    },
  },
];

export function HeroSlider({
  initialSlides,
}: {
  initialSlides?: SlideItem[];
}) {
  const slidesList =
    initialSlides && initialSlides.length > 0 ? initialSlides : SLIDES;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slidesList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, slidesList.length]);

  const slide = slidesList[current] || slidesList[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative rounded-3xl bg-gradient-to-br from-white via-red-50/45 to-zinc-100 border border-red-200/80 shadow-lg overflow-hidden"
      >
        <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

        {/* Main Slide Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-10 lg:p-12 relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold tracking-wide shadow-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-zinc-900 tracking-tight leading-[1.18]">
              {slide.titlePrefix}
              <span className="text-red-600">{slide.titleHighlight}</span>
              {slide.titleSuffix}
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
              {slide.description}
            </p>

            <div className="space-y-2 pt-1">
              {slide.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-zinc-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons (Symmetrical on Mobile) */}
            <div className="pt-2 grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href={slide.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-600/20 transition"
              >
                {slide.primaryCta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 text-sm font-bold transition shadow-2xs"
              >
                {slide.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <Link
              href={slide.featuredCard.href}
              className="group block bg-white rounded-3xl border border-zinc-200/90 p-4 sm:p-5 shadow-xl hover:shadow-2xl hover:border-red-400 transition-all duration-300 relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
                  {slide.featuredCard.tag}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-full">
                  Kontrol Edilmiş
                </span>
              </div>

              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 relative">
                <img
                  src={slide.image}
                  alt={slide.featuredCard.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="pt-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 group-hover:text-red-600 transition">
                    {slide.featuredCard.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {slide.featuredCard.specs}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {slide.featuredCard.oldPrice && (
                    <span className="block text-[11px] text-zinc-400 line-through">
                      {slide.featuredCard.oldPrice}
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-black text-red-600">
                    {slide.featuredCard.price}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="bg-white/90 backdrop-blur-xs border-t border-zinc-200/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            {slidesList.map((s, idx) => {
              const active = idx === current;
              return (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold text-left transition flex items-center gap-2 ${
                    active
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-zinc-100/80 hover:bg-red-50 text-zinc-700 hover:text-red-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      active ? 'bg-white' : 'bg-red-500'
                    }`}
                  />
                  <span className="truncate">{s.tabTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() =>
                setCurrent(
                  (prev) => (prev - 1 + slidesList.length) % slidesList.length
                )
              }
              className="p-2 rounded-xl border border-zinc-200 bg-white hover:border-red-600 hover:text-red-600 text-zinc-700 transition"
              aria-label="Önceki Slayt"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrent((prev) => (prev + 1) % slidesList.length)
              }
              className="p-2 rounded-xl border border-zinc-200 bg-white hover:border-red-600 hover:text-red-600 text-zinc-700 transition"
              aria-label="Sonraki Slayt"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
