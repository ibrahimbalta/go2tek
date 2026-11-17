import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function DistanceSalesTermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
          <ShieldCheck className="w-4 h-4" />
          Tüketici Hakları ve Güvence
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Mesafeli Satış Sözleşmesi, Teknik Kontrol ve İade Koşulları
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">
            1. 14 Noktalı Teknik Kontrol Taahhüdü
          </h2>
          <p>
            Go2Tek üzerinden satılan her ikinci el teknolojik ürün, teslimat öncesinde 14 kriterli donanım ve kozmetik kontrolünden geçirilir ve kontrol raporu kayıt altına alınır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">
            2. Kapora, Ödeme ve Uyuşmazlık Süreci
          </h2>
          <p>
            Özel talep eşleştirmelerinde alınan kapora, cihazın satıcıdan tedarik edilip Go2Tek Teknik Kontrol Merkezinde incelenmesi sürecini güvenceye alır. Cihazın belirtilen teknik veya kozmetik şartları sağlamaması (Teknik kontrolden geçememesi) halinde alıcının kaporası kesintisiz iade edilir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900">
            3. Cayma Hakkı ve Kurumsal Garanti
          </h2>
          <p>
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca alıcılar teslim tarihinden itibaren 14 gün içinde cayma ve uyuşmazlık bildirim hakkına sahiptir. İade/uyuşmazlık başvuruları yönetim panelimizde &quot;15. İade/uyuşmazlık sürecinde&quot; statüsüyle kayıtlı olarak takip edilir.
          </p>
        </section>
      </div>
    </div>
  );
}
