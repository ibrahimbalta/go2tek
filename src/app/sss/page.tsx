import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const faqs = [
    {
      q: 'Özel alıcı talebim veya satıcı teklifim sitede herkese açık ilan olarak yayınlanır mı?',
      a: 'Hayır, kesinlikle yayınlanmaz. Go2Tek bir açık ilan sitesi değildir. Oluşturduğunuz alıcı talepleri ve satıcı teklifleri yalnızca Go2Tek Yönetim Panelinde yetkili uzmanlar tarafından görüntülenir.',
    },
    {
      q: 'Alıcı ve satıcı birbirinin telefon numarasını veya kimlik bilgilerini görebilir mi?',
      a: 'Hayır. KVKK ve güvenlik ilkelerimiz gereği alıcı ve satıcı bilgileri birbirine gösterilmez. Tüm iletişimi, fiyat mutabakatını ve cihaz kontrol sürecini Go2Tek yönetir.',
    },
    {
      q: 'Eşleştirme sistemi nasıl çalışır?',
      a: 'Go2Tek Eşleştirme Merkezi; bütçe uyumu, marka/model, işlemci, RAM, depolama, ekran kartı ve kozmetik durum kriterlerine göre alıcı talebiyle satıcı teklifini karşılaştırır. Son kararı Go2Tek yöneticisi verir ve taraflarla iletişime geçer.',
    },
    {
      q: 'Cihazlar alıcıya teslim edilmeden önce nasıl kontrol ediliyor?',
      a: 'Go2Tek merkezine gelen her cihaz; ekran, klavye, touchpad, USB portları, Wi-Fi, kamera, hoparlör, mikrofon, SSD/HDD sağlığı, RAM, işlemci/sıcaklık stres testi, pil sağlığı, şarj adaptörü ve kozmetik kontrol olmak üzere 14 zorunlu testten geçirilir.',
    },
    {
      q: 'Kapora ve ödeme süreçleri nasıl güvence altına alınır?',
      a: 'Alıcı önerilen cihazı kabul ettiğinde kapora ödemesi doğrulanmış kurumsal banka hesabı veya yetkili ödeme kuruluşu üzerinden kayıt altına alınır. Cihaz 14 noktalı teknik kontrolden geçemezse işlem iptal edilir ve alıcı korunur.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
          <HelpCircle className="w-4 h-4" />
          Yardım Merkezi
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Sıkça Sorulan Sorular (SSS)
        </h1>
        <p className="text-sm text-slate-300">
          Go2Tek Mağaza ve Özel Talep Eşleştirme Sistemi hakkında merak edilenler.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2"
          >
            <h3 className="text-base font-black text-slate-900">{item.q}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
