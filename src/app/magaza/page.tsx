'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard, StoreProductItem } from '@/components/store/ProductCard';
import { PRODUCT_CATEGORIES, COSMETIC_LABELS } from '@/lib/constants';
import { Search, SlidersHorizontal, ShieldCheck, RotateCcw } from 'lucide-react';

export default function StorePage() {
  const [products, setProducts] = useState<StoreProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState('ALL');
  const [cosmetic, setCosmetic] = useState('ALL');
  const [minRamGb, setMinRamGb] = useState('0');
  const [maxPrice, setMaxPrice] = useState('');

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'ALL') params.set('category', category);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (brand !== 'ALL') params.set('brand', brand);
      if (cosmetic !== 'ALL') params.set('cosmetic', cosmetic);
      if (Number(minRamGb) > 0) params.set('minRamGb', minRamGb);
      if (Number(maxPrice) > 0) params.set('maxPrice', maxPrice);

      const res = await fetch(`/api/store/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [category, brand, cosmetic, minRamGb]);

  function handleReset() {
    setCategory('ALL');
    setSearchQuery('');
    setBrand('ALL');
    setCosmetic('ALL');
    setMinRamGb('0');
    setMaxPrice('');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Store Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Go2Tek Resmi Mağaza Stokları
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            14 Noktalı Teknik Kontrolden Geçmiş Garantili Ürünler
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Burada yalnızca Go2Tek’in kendi stokundaki test edilmiş ve satışa hazır ürünler yer alır. Müşteri alım talepleri veya satıcı teklifleri gizlilik ilkemiz gereği mağazada listelenmez.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/butceme-gore-cihaz-bul"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
          >
            Aradığınız Cihaz Stokta Yok mu? Özel Talep Oluşturun →
          </Link>
        </div>
      </div>

      {/* Category Quick Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            category === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Tüm Kategoriler
        </button>
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              category === cat.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            Gelişmiş Teknik Filtreleme
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Filtreleri Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              placeholder="Model, işlemci (M2, i7, Ryzen), GPU ara..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="ALL">Tüm Markalar</option>
            <option value="Apple">Apple</option>
            <option value="ASUS">ASUS</option>
            <option value="Lenovo">Lenovo</option>
            <option value="Samsung">Samsung</option>
            <option value="MSI">MSI</option>
            <option value="Dell">Dell</option>
            <option value="Sony">Sony</option>
            <option value="Logitech">Logitech</option>
          </select>

          <select
            value={minRamGb}
            onChange={(e) => setMinRamGb(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="0">Minimum RAM</option>
            <option value="8">En az 8 GB RAM</option>
            <option value="16">En az 16 GB RAM</option>
            <option value="32">En az 32 GB RAM</option>
          </select>

          <select
            value={cosmetic}
            onChange={(e) => setCosmetic(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="ALL">Tüm Kozmetik Durumlar</option>
            <option value="A_PLUS">{COSMETIC_LABELS.A_PLUS}</option>
            <option value="A">{COSMETIC_LABELS.A}</option>
            <option value="B">{COSMETIC_LABELS.B}</option>
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Maks. Fiyat (TL)"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
            <button
              type="button"
              onClick={fetchProducts}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0"
            >
              Ara
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm font-medium">
          Go2Tek mağaza stokları yükleniyor...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-base font-bold text-slate-800">
            Seçtiğiniz filtrelere uygun hazır mağaza ürünü bulunamadı.
          </p>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Ancak Go2Tek Özel Alıcı Talep Sistemi ile tam bu özelliklerdeki cihazı kapalı devre satıcı havuzumuzdan sizin için bulabiliriz!
          </p>
          <Link
            href="/butceme-gore-cihaz-bul"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Bütçeme Göre Cihaz Talebi Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
