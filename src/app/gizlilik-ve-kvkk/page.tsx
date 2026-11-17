import React from 'react';
import { Lock } from 'lucide-react';

export default function PrivacyKvkkPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
          <Lock className="w-4 h-4" />
          Veri Güvenliği ve Gizlilik
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Gizlilik Politikası ve 6698 Sayılı KVKK Aydınlatma Metni
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">
            1. Veri Sorumlusu ve Temel Gizlilik İlkesi
          </h2>
          <p>
            Go2Tek Teknoloji Ticaret A.Ş. olarak, &quot;Bütçeme Göre Cihaz Bul&quot; ve &quot;Cihazımı Satmak İstiyorum&quot; formları üzerinden iletilen ad-soyad, telefon numarası, cihaz seri numarası ve fotoğrafları 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında yüksek güvenlik önlemleriyle korumaktayız.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">
            2. Başvuruların Herkese Açık Yayınlanmaması Garantisi
          </h2>
          <p>
            Özel alıcı talepleri ve satıcı teklifleri hiçbir koşulda herkese açık web sayfalarında, arama motorlarında veya mağaza listelerinde yayınlanmaz. Alıcı ve satıcıların kişisel iletişim bilgileri birbirine gösterilmez; süreç yalnızca yetkili Go2Tek yöneticileri tarafından yürütülür.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">
            3. Cihaz Seri Numarası ve Dosya Güvenliği
          </h2>
          <p>
            Satıcılar tarafından paylaşılan cihaz seri numaraları sahtecilik önleme ve teknik kontrol doğrulaması amacıyla alınmakta olup, yetkisiz erişime karşı maskelenerek saklanır.
          </p>
        </section>
      </div>
    </div>
  );
}
