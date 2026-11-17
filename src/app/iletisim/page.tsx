import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { getSiteSettings } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
          <ShieldCheck className="w-4 h-4" />
          Go2Tek Kurumsal İletişim & Ekspertiz Merkezi
        </div>
        <h1 className="text-3xl font-black">İletişim</h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Mağaza ürünlerimiz, özel alıcı talepleriniz veya satıcı teklif süreçleriniz hakkında uzman ekibimizle doğrudan iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
          <h2 className="text-lg font-black text-slate-900">
            Merkez Ofis & Teknik Kontrol Laboratuvarı
          </h2>
          <ul className="space-y-4 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Adres</strong>
                {settings.address}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Müşteri Hizmetleri & Eşleştirme Hattı</strong>
                {settings.phone}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Kurumsal E-posta</strong>
                {settings.email}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Çalışma Saatleri</strong>
                {settings.workingHours}
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <h2 className="text-lg font-black text-slate-900">
            Özel Alım-Satım Süreçlerinde İletişim Kuralımız
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Go2Tek’te alıcı ve satıcıların telefon numaraları veya kişisel verileri kesinlikle birbirine aktarılmaz. Eşleştirme, fiyat mutabakatı, kapora güvencesi ve 14 noktalı teknik kontrol süreçlerinin tamamı Go2Tek müşteri temsilcileri üzerinden yürütülür.
          </p>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <strong className="block">Mevcut Başvurunuz İçin:</strong>
            <span>
              Başvuru numaranızı (Örn: G2T-AL-2026-XXXX) belirterek müşteri temsilcimizden anında bilgi alabilirsiniz.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
