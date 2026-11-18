'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Go2TekLogo } from './Go2TekLogo';
import { useCart } from '@/context/CartContext';
import {
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Menu,
  X,
  FileSearch,
  ShoppingBag,
  Phone,
  Home,
  LayoutGrid,
} from 'lucide-react';

export function Navbar({
  topBarText = 'Go2Tek Bartın 2.El Teknoloji Mağazası • Alım - Satım - Takas',
  phone = '0 (545) 346 79 86',
}: {
  topBarText?: string;
  phone?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { items, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/magaza?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push('/magaza');
    }
  }

  const navCategories = [
    { href: '/magaza', label: 'Tüm Ürünler' },
    { href: '/magaza/notebook', label: '2.El Notebook' },
    { href: '/magaza/masaustu-bilgisayar', label: 'Masaüstü PC' },
    { href: '/magaza/telefon', label: '2.El Telefon' },
    { href: '/magaza/tablet', label: '2.El Tablet' },
    { href: '/magaza/diger-elektronik', label: 'Monitör & Aksesuar' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
        {/* Symmetrical Top Utility Bar */}
        <div className="bg-red-600 text-white text-[11px] sm:text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex items-center gap-1.5 font-semibold truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="sm:hidden">Alım • Satım • Takas</span>
                <span className="hidden sm:inline">{topBarText}</span>
              </span>
              <span className="hidden md:inline text-red-300">|</span>
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="hidden md:inline-flex items-center gap-1.5 text-red-50 hover:text-white font-medium shrink-0"
              >
                <Phone className="w-3 h-3 text-white" />
                {phone}
              </a>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 font-medium shrink-0">
              <Link
                href="/basvuru-sorgula"
                className="inline-flex items-center gap-1 text-white hover:text-red-100 transition"
              >
                <FileSearch className="w-3.5 h-3.5" />
                <span>Başvuru Sorgula</span>
              </Link>
              <Link
                href="/hakkimizda"
                className="hidden sm:inline text-red-50 hover:text-white transition"
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                className="hidden sm:inline text-red-50 hover:text-white transition"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          <Link href="/" className="shrink-0">
            <Go2TekLogo variant="light" size="md" />
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative"
          >
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün, marka veya model ara (Örn: MacBook, RTX 4060, iPad)..."
              className="w-full pl-11 pr-20 py-2.5 rounded-full border border-zinc-200 bg-zinc-50/80 focus:bg-white focus:border-red-600 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition"
            >
              Ara
            </button>
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/butceme-gore-cihaz-bul"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Bütçeme Göre Cihaz Bul
            </Link>

            <Link
              href="/cihazimi-satmak-istiyorum"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition"
            >
              <Tag className="w-3.5 h-3.5 text-red-400" />
              Cihazımı Sat
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-800 text-xs font-semibold transition"
              aria-label="Sepetim"
            >
              <ShoppingBag className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">Sepetim</span>
              {items.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Always-Visible Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Notebook, PC, Telefon, Tablet ara..."
              className="w-full pl-10 pr-16 py-2.5 rounded-full border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-red-600 text-xs text-zinc-900 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-red-600 text-white text-xs font-semibold"
            >
              Ara
            </button>
          </form>
        </div>

        {/* Symmetrical Category Bar (Pills on Mobile, Clean Tabs on Desktop) */}
        <div className="border-t border-zinc-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 md:py-0 md:h-11 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-2 md:gap-6">
              {navCategories.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs sm:text-[13px] font-semibold whitespace-nowrap transition md:py-2.5 md:border-b-2 md:rounded-none md:bg-transparent px-3.5 py-1.5 rounded-full ${
                      active
                        ? 'bg-red-600 text-white md:bg-transparent md:border-red-600 md:text-red-600'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 md:border-transparent md:text-zinc-600 md:hover:text-zinc-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <span className="hidden xl:inline text-xs text-zinc-400 font-medium shrink-0">
              2.El Bilgisayar • Notebook • Telefon • Tablet • Aksesuar
            </span>
          </div>
        </div>

        {/* Symmetrical Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {navCategories.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-center text-xs font-semibold transition ${
                      active
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
              <Link
                href="/butceme-gore-cihaz-bul"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 rounded-xl bg-red-600 text-white text-center text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Cihaz Bul</span>
              </Link>
              <Link
                href="/cihazimi-satmak-istiyorum"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 rounded-xl bg-zinc-900 text-white text-center text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Cihazımı Sat</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 text-center">
              <Link
                href="/basvuru-sorgula"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 rounded-lg bg-zinc-50 text-zinc-700 text-[11px] font-semibold"
              >
                Başvuru Sorgula
              </Link>
              <Link
                href="/hakkimizda"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 rounded-lg bg-zinc-50 text-zinc-700 text-[11px] font-semibold"
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 rounded-lg bg-zinc-50 text-zinc-700 text-[11px] font-semibold"
              >
                İletişim
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Symmetrical Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 grid grid-cols-5 items-center gap-1">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center h-12 rounded-xl text-[10px] font-semibold transition ${
            pathname === '/' ? 'text-red-600 bg-red-50/70' : 'text-zinc-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Ana Sayfa</span>
        </Link>
        <Link
          href="/magaza"
          className={`flex flex-col items-center justify-center h-12 rounded-xl text-[10px] font-semibold transition ${
            pathname.startsWith('/magaza')
              ? 'text-red-600 bg-red-50/70'
              : 'text-zinc-500'
          }`}
        >
          <LayoutGrid className="w-4 h-4 mb-0.5" />
          <span>Mağaza</span>
        </Link>
        <Link
          href="/butceme-gore-cihaz-bul"
          className="flex flex-col items-center justify-center h-12 rounded-xl bg-red-600 text-white text-[10px] font-semibold shadow-sm"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Cihaz Bul</span>
        </Link>
        <Link
          href="/cihazimi-satmak-istiyorum"
          className={`flex flex-col items-center justify-center h-12 rounded-xl text-[10px] font-semibold transition ${
            pathname === '/cihazimi-satmak-istiyorum'
              ? 'text-red-600 bg-red-50/70'
              : 'text-zinc-500'
          }`}
        >
          <Tag className="w-4 h-4 mb-0.5" />
          <span>Cihaz Sat</span>
        </Link>
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center h-12 rounded-xl text-[10px] font-semibold text-zinc-600 relative"
        >
          <ShoppingBag className="w-4 h-4 mb-0.5 text-red-600" />
          <span>Sepet ({items.length})</span>
        </button>
      </nav>
    </>
  );
}
