'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Laptop,
  Tablet,
  Monitor,
  Cpu,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Menu,
  X,
  Lock,
  FileSearch,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/magaza', label: 'Mağaza', icon: Search },
    { href: '/magaza/notebook', label: 'Notebook', icon: Laptop },
    { href: '/magaza/tablet', label: 'Tablet', icon: Tablet },
    { href: '/magaza/masaustu-bilgisayar', label: 'Masaüstü PC', icon: Monitor },
    { href: '/magaza/diger-elektronik', label: 'Diğer Elektronik', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top corporate trust bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              14 Noktalı Go2Tek Teknik Kontrol Güvencesi
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              Özel Alım-Satım Başvuruları Herkese Açık Yayınlanmaz • %100 Gizli Eşleştirme
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/basvuru-sorgula"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-400" />
              Başvuru Sorgula
            </Link>
            <Link
              href="/hakkimizda"
              className="hidden md:inline text-slate-300 hover:text-white transition"
            >
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className="hidden md:inline text-slate-300 hover:text-white transition"
            >
              İletişim
            </Link>
            <Link
              href="/yonetim"
              className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 font-medium transition"
            >
              <Lock className="w-3 h-3" />
              Yönetim Paneli
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center border border-blue-500/30 shadow-sm group-hover:bg-blue-600 transition-colors">
            <span className="text-white font-black text-lg tracking-tighter">
              G2<span className="text-blue-400 group-hover:text-white">T</span>
            </span>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              GO<span className="text-blue-600">2</span>TEK
            </span>
            <p className="text-[11px] font-medium text-slate-500 -mt-1">
              Kurumsal 2. El Teknoloji & Özel Eşleştirme
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/butceme-gore-cihaz-bul"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <Sparkles className="w-4 h-4" />
            Bütçeme Göre Cihaz Bul
          </Link>
          <Link
            href="/cihazimi-satmak-istiyorum"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition"
          >
            <Tag className="w-4 h-4 text-blue-400" />
            Cihazımı Satmak İstiyorum
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
          aria-label="Menüyü Aç"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4 text-blue-600" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/butceme-gore-cihaz-bul"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              Bütçeme Göre Cihaz Bul
            </Link>
            <Link
              href="/cihazimi-satmak-istiyorum"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold"
            >
              <Tag className="w-4 h-4 text-blue-400" />
              Cihazımı Satmak İstiyorum
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
