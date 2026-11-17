import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Lock, Award, Cpu } from 'lucide-react';
import { INSPECTION_CRITERIA } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-4">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Go2Tek Kurumsal Vizyonu
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">
          İkinci El Teknolojide Güven, Teknik Kontrol ve Gizli Eşleştirme Merkezi
        </h1>
        <p className="text-slate-300 text-base leading-relaxed max-w-3xl">
          Go2Tek; ikinci el notebook, tablet, masaüstü bilgisayar ve elektronik ürünlerin ticaretinde güvensiz açık ilan sitelerinin yarattığı riskleri ortadan kaldırmak için kurulmuş yeni nesil bir teknoloji platformudur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            A. Go2Tek Doğrudan Mağaza Modeli
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Go2Tek’in kendi stoklarında yer alan tüm ürünler, satışa çıkmadan önce 14 aşamalı donanım, batarya ve stres testinden geçirilir. Kozmetik durumu şeffafça derecelendirilir ve kurumsal Go2Tek garantisiyle doğrudan satışa sunulur.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            B. Kapalı Devre Özel Talep Eşleştirme Modeli
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Alıcılar bütçelerini ve istedikleri özellikleri girer; satıcılar ise cihazlarını ve fiyat beklentilerini paylaşır. Bu başvurular kesinlikle herkese açık ilan olarak yayınlanmaz. Go2Tek yöneticileri doğru alıcı ve satıcıyı eşleştirir, cihazı teslim alıp 14 noktalı teknik kontrolden geçirir ve işlemi güvenle tamamlar.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
          <Award className="w-5 h-5" />
          <span>14 Noktalı Go2Tek Teknik Kontrol Standartlarımız</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {INSPECTION_CRITERIA.map((item) => (
            <div
              key={item.field}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2 font-semibold text-slate-800"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {item.index}. {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/magaza"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Mağaza Ürünlerini İncele
          </Link>
          <Link
            href="/butceme-gore-cihaz-bul"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Bütçeme Göre Cihaz Bul
          </Link>
        </div>
      </div>
    </div>
  );
}
