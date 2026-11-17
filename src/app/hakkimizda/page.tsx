import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Lock, Cpu } from 'lucide-react';
import { INSPECTION_CRITERIA } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 space-y-4 border-b-4 border-red-600">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Go2Tek 2.El Teknoloji Mağazası
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">
          İkinci El Teknolojide Şeffaf Alışveriş ve Özel Talep Eşleştirme
        </h1>
        <p className="text-zinc-300 text-base leading-relaxed max-w-3xl">
          Go2Tek; ikinci el notebook, tablet, masaüstü bilgisayar, telefon ve elektronik ürünlerin alım-satımında açık ilan sitelerinin karmaşasını ortadan kaldıran kurumsal bir mağaza ve özel eşleştirme platformudur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">
            A. Go2Tek Mağaza Modeli
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Mağaza stoklarımızdaki cihazların temel çalışma kontrolleri yapılır, mevcut kozmetik durumları ve donanım özellikleri olduğu gibi şeffaf biçimde belirtilerek satışa sunulur.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">
            B. Özel Alım-Satım Talep Sistemi
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Alıcılar bütçelerini ve istedikleri özellikleri girer; satıcılar ise cihazlarını ve fiyat beklentilerini paylaşır. Bu başvurular herkese açık ilan olarak yayınlanmaz; Go2Tek uygun alıcı ve satıcıyı eşleştirerek süreci güvenli şekilde yönetir.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-zinc-900">
            Genel Cihaz İnceleme Başlıklarımız
          </h3>
          <p className="text-xs text-zinc-500">
            Mağazamıza ulaşan cihazlarda kontrol edilen temel donanım ve kozmetik noktalar:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {INSPECTION_CRITERIA.map((item) => (
            <div
              key={item.field}
              className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center gap-2 font-medium text-zinc-800"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/magaza"
            className="px-5 py-2.5 rounded-full bg-red-600 text-white text-xs font-semibold"
          >
            Mağaza Ürünlerini İncele
          </Link>
          <Link
            href="/butceme-gore-cihaz-bul"
            className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold"
          >
            Bütçeme Göre Cihaz Bul
          </Link>
        </div>
      </div>
    </div>
  );
}
