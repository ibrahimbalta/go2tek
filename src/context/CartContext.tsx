'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export interface CartItem {
  id: string;
  slug: string;
  sku: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  cosmeticCondition: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('go2tek_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  function syncItems(next: CartItem[]) {
    setItems(next);
    try {
      localStorage.setItem('go2tek_cart', JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function addToCart(item: CartItem) {
    const exists = items.some((x) => x.id === item.id);
    if (!exists) {
      syncItems([...items, item]);
    }
    setIsOpen(true);
  }

  function removeFromCart(id: string) {
    syncItems(items.filter((x) => x.id !== id));
  }

  function clearCart() {
    syncItems([]);
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
      }}
    >
      {children}

      {/* Slide-over Shopping Cart Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l-4 border-red-600">
            {/* Drawer Header */}
            <div className="p-5 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base">Alışveriş Sepetim</h3>
                  <p className="text-[11px] text-zinc-400">
                    {items.length} Adet Seçili Ürün
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-zinc-900 text-sm">
                      Sepetinizde henüz ürün bulunmuyor.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Go2Tek Mağaza stoklarındaki garantili cihazları hemen inceleyebilirsiniz.
                    </p>
                  </div>
                  <Link
                    href="/magaza"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
                  >
                    Mağaza Ürünlerini Keşfet
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 flex items-center gap-3.5"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-14 rounded-xl bg-white border border-zinc-200 p-1 object-contain shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        {item.brand} • Stok: {item.sku}
                      </span>
                      <Link
                        href={`/urun/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block text-xs font-bold text-zinc-900 hover:text-red-600 truncate"
                      >
                        {item.title}
                      </Link>
                      <div className="text-sm font-black text-zinc-900 mt-1">
                        {item.price.toLocaleString('tr-TR')}{' '}
                        <span className="text-xs text-red-600">TL</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Sepetten Çıkar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-600">
                    Sepet Toplamı (KDV & Ekspertiz Dahil)
                  </span>
                  <span className="text-xl font-black text-zinc-900">
                    {totalAmount.toLocaleString('tr-TR')}{' '}
                    <span className="text-sm text-red-600">TL</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-700 bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-xl font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Genel Kontrolleri Yapılmış Go2Tek Mağaza Ürünü</span>
                </div>

                <Link
                  href={`/urun/${items[0].slug}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition"
                >
                  Sipariş ve Ödeme Adımına Geç
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
