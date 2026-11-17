import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white">
                G2T
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                GO<span className="text-blue-500">2</span>TEK
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Go2Tek; kendi stokundaki 14 noktalı teknik kontrolden geçmiş teknolojik ürünleri satan ve özel talep eşleştirme sistemiyle müşterilerine güvenli alım-satım aracılığı sunan kurumsal teknoloji platformudur.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Özel Talepler Herkese Açık İlan Olarak Yayınlanmaz</span>
            </div>
          </div>

          {/* Column 2: Mağaza Kategorileri */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Go2Tek Mağaza
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/magaza" className="hover:text-blue-400 transition">
                  Tüm Mağaza Ürünleri
                </Link>
              </li>
              <li>
                <Link href="/magaza/notebook" className="hover:text-blue-400 transition">
                  İkinci El Notebook
                </Link>
              </li>
              <li>
                <Link href="/magaza/tablet" className="hover:text-blue-400 transition">
                  Tablet
                </Link>
              </li>
              <li>
                <Link
                  href="/magaza/masaustu-bilgisayar"
                  className="hover:text-blue-400 transition"
                >
                  Masaüstü Bilgisayar
                </Link>
              </li>
              <li>
                <Link
                  href="/magaza/diger-elektronik"
                  className="hover:text-blue-400 transition"
                >
                  Monitör, Telefon, Parça & Diğer Elektronik
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Özel Talep & Kurumsal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Özel Talep & Kurumsal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/butceme-gore-cihaz-bul"
                  className="text-blue-400 hover:text-blue-300 font-medium transition"
                >
                  Bütçeme Göre Cihaz Bul (Alıcı Talebi)
                </Link>
              </li>
              <li>
                <Link
                  href="/cihazimi-satmak-istiyorum"
                  className="text-blue-400 hover:text-blue-300 font-medium transition"
                >
                  Cihazımı Satmak İstiyorum (Satıcı Teklifi)
                </Link>
              </li>
              <li>
                <Link href="/basvuru-sorgula" className="hover:text-white transition">
                  Başvuru Numarası ile Durum Sorgula
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-white transition">
                  Hakkımızda & 14 Noktalı Ekspertiz
                </Link>
              </li>
              <li>
                <Link href="/sss" className="hover:text-white transition">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white transition">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Yasal & İletişim */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Yasal & İletişim Merkezi
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Kozyatağı Teknoloji Plaza Kat:4, Kadıköy / İstanbul</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>0 (216) 550 20 26</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>iletisim@go2tek.com</span>
              </li>
            </ul>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2 text-xs text-slate-400">
              <Link href="/gizlilik-ve-kvkk" className="hover:text-white transition">
                Gizlilik Politikası ve KVKK Aydınlatma Metni
              </Link>
              <Link
                href="/mesafeli-satis-ve-iade-kosullari"
                className="hover:text-white transition"
              >
                Mesafeli Satış Sözleşmesi ve İade Koşulları
              </Link>
              <Link
                href="/yonetim"
                className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-400 transition mt-1"
              >
                <Lock className="w-3 h-3" />
                Go2Tek Yönetim & Personel Girişi
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Go2Tek Teknoloji Ticaret A.Ş. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ekspertiz Onaylı Cihazlar
            </span>
            <span>•</span>
            <span>KVKK Uyumlu Kapalı Devre Eşleştirme</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
