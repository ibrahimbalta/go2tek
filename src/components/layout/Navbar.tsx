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
  Lock,
  FileSearch,
  ShoppingBag,
  Phone,
  Home,
  LayoutGrid,
} from 'lucide-react';

export function Navbar({
  topBarText = 'Go2Tek 2.El Teknoloji Mağazası • Alım - Satım - Takas',
  phone = '0 (216) 550 20 26',
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
    { href: '/magaza/masaustu-bilgisayar', label: 'Masaüstü Bilgisayar' },
    { href: '/magaza/telefon', label: '2.El Telefon' },
    { href: '/magaza/tablet', label: '2.El Tablet' },
    { href: '/magaza/diger-elektronik', label: 'Monitör, Parça & Aksesuar' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
        {/* Clean, Light-Red Tinted Top Utility Bar */}
        <div className="bg-red-600 text-white text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                {topBarText}
              </span>
              <span className="hidden md:inline text-red-300">|</span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-red-50 font-medium">
                <Phone className="w-3 h-3 text-white" />
                {phone}
              </span>
            </div>

            <div className="flex items-center gap-5 font-medium">
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

        {/* Main Header Row: Logo + Clean Search + Clear Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Go2TekLogo variant="light" size="md" />
          </Link>

          {/* Clean Central Search Bar */}
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
          <div className="flex items-center gap-2.5">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-800 text-xs font-semibold transition"
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
              className="lg:hidden p-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Category Bar */}
        <div className="border-t border-zinc-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-6">
              {navCategories.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs sm:text-[13px] font-semibold whitespace-nowrap py-2.5 border-b-2 transition ${
                      active
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <span className="hidden xl:inline text-xs text-zinc-400 font-medium">
              2.El Bilgisayar • Notebook • Telefon • Tablet • Aksesuar
            </span>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün veya model ara..."
                className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-red-600 text-white text-xs font-semibold"
              >
                Ara
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2">
              {navCategories.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-zinc-100">
              <Link
                href="/butceme-gore-cihaz-bul"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-red-600 text-white text-center text-xs font-semibold"
              >
                Bütçeme Göre Cihaz Bul
              </Link>
              <Link
                href="/cihazimi-satmak-istiyorum"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-zinc-900 text-white text-center text-xs font-semibold"
              >
                Cihazımı Satmak İstiyorum
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 shadow-lg px-2 py-1.5 grid grid-cols-5 gap-1">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 text-[10px] font-semibold ${
            pathname === '/' ? 'text-red-600' : 'text-zinc-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Ana Sayfa</span>
        </Link>
        <Link
          href="/magaza"
          className={`flex flex-col items-center justify-center py-1 text-[10px] font-semibold ${
            pathname.startsWith('/magaza') ? 'text-red-600' : 'text-zinc-500'
          }`}
        >
          <LayoutGrid className="w-4 h-4 mb-0.5" />
          <span>Mağaza</span>
        </Link>
        <Link
          href="/butceme-gore-cihaz-bul"
          className="flex flex-col items-center justify-center py-1 rounded-xl bg-red-600 text-white text-[10px] font-semibold"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Cihaz Bul</span>
        </Link>
        <Link
          href="/cihazimi-satmak-istiyorum"
          className={`flex flex-col items-center justify-center py-1 text-[10px] font-semibold ${
            pathname === '/cihazimi-satmak-istiyorum'
              ? 'text-red-600'
              : 'text-zinc-500'
          }`}
        >
          <Tag className="w-4 h-4 mb-0.5" />
          <span>Cihaz Sat</span>
        </Link>
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 text-[10px] font-semibold text-zinc-600"
        >
          <ShoppingBag className="w-4 h-4 mb-0.5 text-red-600" />
          <span>Sepet ({items.length})</span>
        </button>
      </nav>
    </>
  );
}

