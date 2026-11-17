import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/store/ProductCard';
import { PRODUCT_CATEGORIES, INSPECTION_CRITERIA } from '@/lib/constants';
import {
  ShieldCheck,
  Sparkles,
  Tag,
  ArrowRight,
  Lock,
  CheckCircle2,
  Cpu,
  SlidersHorizontal,
  UserCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Strictly query ONLY published Go2Tek store products
  const featuredProducts = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1d4ed8_0%,transparent_50%)] opacity-35" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Go2Tek İkili İş Modeli • Doğrudan Mağaza & Gizli Eşleştirme
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Kontrollü İkinci El Teknoloji Mağazası ve{' '}
                <span className="text-blue-400">Özel Talep Eşleştirme</span> Merkezi
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                İster Go2Tek’in 14 noktalı teknik kontrolden geçmiş kendi stok ürünlerini doğrudan satın alın; ister bütçenizi ve istediğiniz özellikleri girerek{' '}
                <strong className="text-white">herkese açık ilan yayınlamadan</strong> size en uygun cihazı bulup test ederek teslim etmemizi sağlayın.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/magaza"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition"
                >
                  Mağaza Stoklarını İncele
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/butceme-gore-cihaz-bul"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Bütçeme Göre Cihaz Bul
                </Link>
                <Link
                  href="/cihazimi-satmak-istiyorum"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-sm transition"
                >
                  <Tag className="w-4 h-4 text-emerald-400" />
                  Cihazımı Satmak İstiyorum
                </Link>
              </div>

              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>14 Kriterli Donanım Testi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Gizli Alıcı & Satıcı Havuzu</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Go2Tek Güvenceli Teslimat</span>
                </div>
              </div>
            </div>

            {/* Right Dual Business Model Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      Go2Tek Farkı Nedir?
                    </span>
                    <h2 className="text-lg font-extrabold text-white mt-0.5">
                      2 Temel İş Modeli ile Sıfır Risk
                    </h2>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-blue-400" />
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">A. Go2Tek Doğrudan Mağaza</span>
                      <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 text-[11px] font-bold">
                        Hazır Stok
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Go2Tek’in kendi stokundaki notebook, tablet, masaüstü bilgisayar ve bileşenler 14 kriterli ekspertiz raporu ve kurumsal garantiyle doğrudan satılır.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/50 border border-blue-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        B. Özel Alım-Satım Talep Sistemi
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                        Gizli Eşleştirme
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Alıcı bütçesini ve aradığı özellikleri girer; satıcı ise cihazını ve fiyatını bildirir. Başvurular kesinlikle herkese açık ilan olmaz. Go2Tek yöneticisi uygun cihazı eşleştirir, teknik kontrolden geçirir ve güvenle teslim eder.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Mağaza Kategorileri
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              8 Farklı Teknoloji Kategorisinde Garantili Stok
            </h2>
          </div>
          <Link
            href="/magaza"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            Tüm Mağazayı Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/magaza/${cat.slug}`}
              className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-sm sm:text-base">
                  {cat.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Store Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Go2Tek Mağaza Vitrini
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Teknik Kontrolden Geçmiş Hazır Stok Ürünlerimiz
            </h2>
          </div>
          <Link
            href="/magaza"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Gelişmiş Mağaza Filtresi
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Private Request & Seller Offer CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buyer Request Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Özel Alıcı Talep Sistemi
              </span>
              <h3 className="text-2xl font-black">
                Aradığınız Cihazı Bütçenize Göre Biz Bulalım
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                İstediğiniz işlemci, RAM, ekran kartı ve bütçe aralığını girin. Başvurunuz herkese açık yayınlanmaz; Go2Tek kapalı devre satıcı havuzundan en uygun cihazı eşleştirip 14 noktalı teknik kontrolden geçirerek size sunar.
              </p>
            </div>
            <div>
              <Link
                href="/butceme-gore-cihaz-bul"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition"
              >
                Bütçeme Göre Cihaz Talebi Oluştur
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Seller Offer Card */}
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 border-2 border-slate-200 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Özel Satıcı Teklif Sistemi
              </span>
              <h3 className="text-2xl font-black">
                Cihazınızı Herkese Açık İlanlarla Uğraşmadan Güvenle Satın
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Notebook, tablet veya masaüstü bilgisayarınızın özelliklerini, fotoğraflarını ve istediğiniz satış fiyatını gönderin. Telefon numaranız ve seri numaranız kimseyle paylaşılmaz; tüm süreci Go2Tek yönetir.
              </p>
            </div>
            <div>
              <Link
                href="/cihazimi-satmak-istiyorum"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold transition"
              >
                Cihaz Satış Teklifi Oluştur
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 14-Point Technical Inspection Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Go2Tek Kalite Standardı
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              14 Noktalı Go2Tek Teknik Kontrol Protokolü
            </h2>
            <p className="text-sm text-slate-600">
              Hem mağaza stoklarımızdaki hem de özel eşleştirme sistemiyle tedarik edilen her cihaz, alıcıya teslim edilmeden önce donanım uzmanlarımız tarafından aşağıdaki 14 zorunlu testten geçirilir:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {INSPECTION_CRITERIA.map((item) => (
              <div
                key={item.field}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.index}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
