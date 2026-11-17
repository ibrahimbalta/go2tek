import React from 'react';
import Link from 'next/link';
import { Go2TekLogo } from './Go2TekLogo';
import {
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Wrench,
  Handshake,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t-4 border-red-600 mt-20 pb-20 md:pb-0">
      {/* Top 4 Storefront Trust Pillars Banner (Matching Left Column of Storefront Sign) */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Kontrollü Ürünler</h4>
              <p className="text-[11px] text-zinc-400">
                Genel Kontrolleri Yapılmış Cihazlar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/20">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Alım - Satım - Takas</h4>
              <p className="text-[11px] text-zinc-400">
                Değerinde Alım & Özel Eşleştirme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Teknik Destek</h4>
              <p className="text-[11px] text-zinc-400">
                Cihaz Kontrol & Bakım Hizmeti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/20">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Güvenilir Alışveriş</h4>
              <p className="text-[11px] text-red-400 font-bold italic">
                Teknolojide Doğru Adres!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand (Illuminated Counter Sign Look) */}
          <div className="space-y-4">
            <Go2TekLogo variant="dark" size="md" />
            <p className="text-sm text-zinc-400 leading-relaxed">
              Go2Tek 2.El Teknoloji Mağazası; kendi stokundaki 14 noktalı teknik kontrolden geçmiş bilgisayar, notebook, telefon, tablet ve aksesuarları satan, aynı zamanda özel talep eşleştirme sistemiyle güvenli alım-satım aracılığı sunan kurumsal teknoloji merkezidir.
            </p>
            <div className="flex items-center gap-2 text-xs text-red-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Özel Talepler Herkese Açık İlan Olarak Yayınlanmaz</span>
            </div>
          </div>

          {/* Column 2: Mağaza Kategorileri */}
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-2.5">
              2.El Teknoloji Mağazası
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/magaza" className="hover:text-red-400 transition">
                  Tüm Mağaza Ürünleri
                </Link>
              </li>
              <li>
                <Link href="/magaza/notebook" className="hover:text-red-400 transition">
                  2.El Notebook
                </Link>
              </li>
              <li>
                <Link
                  href="/magaza/masaustu-bilgisayar"
                  className="hover:text-red-400 transition"
                >
                  2.El Bilgisayar (Masaüstü & Sistem)
                </Link>
              </li>
              <li>
                <Link href="/magaza/telefon" className="hover:text-red-400 transition">
                  2.El Telefon
                </Link>
              </li>
              <li>
                <Link href="/magaza/tablet" className="hover:text-red-400 transition">
                  2.El Tablet
                </Link>
              </li>
              <li>
                <Link
                  href="/magaza/diger-elektronik"
                  className="hover:text-red-400 transition"
                >
                  Aksesuar, Monitör & Bilgisayar Parçaları
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Özel Talep & Kurumsal */}
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-2.5">
              Alım - Satım & Özel Talep
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/butceme-gore-cihaz-bul"
                  className="text-red-400 hover:text-red-300 font-bold transition"
                >
                  Bütçeme Göre Cihaz Bul (Özel Alıcı Talebi)
                </Link>
              </li>
              <li>
                <Link
                  href="/cihazimi-satmak-istiyorum"
                  className="text-red-400 hover:text-red-300 font-bold transition"
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
                  Mağaza Adres & İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Yasal & İletişim */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-2.5">
              Mağaza & İletişim Merkezi
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Kozyatağı Teknoloji Caddesi No:24, Kadıköy / İstanbul</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>0 (216) 550 20 26</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>iletisim@go2tek.com</span>
              </li>
            </ul>
            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2 text-xs text-zinc-400">
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
                className="inline-flex items-center gap-1 text-zinc-500 hover:text-red-400 transition mt-1"
              >
                <Lock className="w-3 h-3" />
                Go2Tek Yönetim & Personel Girişi
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © 2026 Go2Tek 2.El Teknoloji Mağazası. Tüm hakları saklıdır.{' '}
            <strong className="text-red-500 italic">Teknolojide Doğru Adres!</strong>
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              14 Noktalı Ekspertiz Onaylı
            </span>
            <span>•</span>
            <span>KVKK Uyumlu Kapalı Devre Eşleştirme</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
