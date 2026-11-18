import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  RefreshCw,
  Handshake,
  ArrowRight,
  MapPin,
  Sparkles,
  Linkedin,
  ExternalLink,
} from 'lucide-react';

export function AboutSection({
  imageSrc = '/images/go2tek-hakkimizda.jpg',
  compact = false,
}: {
  imageSrc?: string;
  compact?: boolean;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Portrait & Store Interior Photo */}
          <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] bg-zinc-900">
            <img
              src={imageSrc}
              alt="İbrahim BALTA — Go2Tek 2.El Teknoloji Mağazası Bartın"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/95 backdrop-blur-xs text-xs font-bold shadow-md">
                <MapPin className="w-3.5 h-3.5" />
                <span>Bartın • Go2Tek Mağazası</span>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-semibold">
                Teknolojide Doğru Adres
              </span>
            </div>
          </div>

          {/* Right Persuasive Story & Value Pillars */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
                Hakkımızda • Go2Tek Hikayesi
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-snug">
                Bartın’da Test Edilmiş Teknoloji ve{' '}
                <span className="text-red-600">Güvenilir Takasın</span> Doğru Adresi
              </h2>

              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong className="text-zinc-900">Go2Tek</strong>; temel donanım ve çalışma kontrollerinden geçirilmiş bilgisayar, notebook, tablet, telefon ve teknolojik araçları{' '}
                  <strong className="text-zinc-900">Bartınlılara uygun ve adil fiyatlarla</strong> sunan yeni nesil bir teknoloji girişimidir.
                </p>
                <p>
                  Amacımız yalnızca ikinci el cihaz satmak değildir. Mevcut cihazınızı satmak ya da bir üst modele yükseltmek istediğinizde, açık ilan sitelerinin belirsizliği ve zaman kaybı olmadan ürünlerinizi{' '}
                  <strong className="text-zinc-900">gerçek değeri üzerinden nakit alım veya takas</strong> yöntemiyle değerlendirmenizi sağlarız.
                </p>
                <p>
                  <strong className="text-zinc-900">Müşteri memnuniyetini</strong> ilk sıraya koyan,{' '}
                  <strong className="text-red-600">güveni ise vazgeçilmez düsturu</strong> edinen Go2Tek’te; ister mağaza stoklarımızdaki kontrol edilmiş cihazları görerek alın, ister bütçenize göre özel talep oluşturun — şeffaf, hızlı ve güvenli bir deneyim sunuyoruz.
                </p>
              </div>
            </div>

            {/* 3 Clear Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <div className="text-xs font-extrabold text-zinc-900">
                  Test Edilmiş Cihazlar
                </div>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Kontrol edilmiş, temiz ve bütçe dostu teknolojik ürünler.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <RefreshCw className="w-5 h-5 text-red-600" />
                <div className="text-xs font-extrabold text-zinc-900">
                  Değerinde Alım & Takas
                </div>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Cihazınızı satmak veya yükseltmek için adil değerleme.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <Handshake className="w-5 h-5 text-red-600" />
                <div className="text-xs font-extrabold text-zinc-900">
                  Önce Güven & Memnuniyet
                </div>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Şeffaf durum bilgisi ve gizli özel eşleştirme güvencesi.
                </p>
              </div>
            </div>

            {/* Founder / Expert Card: İbrahim BALTA */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-zinc-900">
                  İbrahim BALTA
                </div>
                <div className="text-xs font-semibold text-red-600">
                  Yazılım Test Uzmanı
                </div>
              </div>
              <a
                href="https://www.linkedin.com/in/ibrahimbalta/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold shadow-xs transition shrink-0"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn Profili</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/butceme-gore-cihaz-bul"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                Bütçeme Göre Cihaz Bul
              </Link>
              <Link
                href="/cihazimi-satmak-istiyorum"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition"
              >
                Cihazımı Sat / Takasla
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {!compact && (
                <Link
                  href="/hakkimizda"
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline px-2"
                >
                  Detaylı Bilgi →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
