'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Store,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface CartItem {
  id: string;
  slug: string;
  sku: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  cosmeticCondition: string;
  shopierUrl?: string | null;
  sahibindenUrl?: string | null;
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
  const [step, setStep] = useState<'CART' | 'CHECKOUT'>('CART');
  const [method, setMethod] = useState<'IN_STORE_RESERVE' | 'BANK_TRANSFER_EFT'>(
    'IN_STORE_RESERVE'
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    orderNo?: string;
    message: string;
  } | null>(null);

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
    setStep('CART');
    setOrderResult(null);
    setIsOpen(true);
  }

  function removeFromCart(id: string) {
    const next = items.filter((x) => x.id !== id);
    syncItems(next);
    if (next.length === 0) setStep('CART');
  }

  function clearCart() {
    syncItems([]);
    setStep('CART');
  }

  function closeDrawer() {
    setIsOpen(false);
    setStep('CART');
    setOrderResult(null);
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const primaryItem = items[0];

  async function handleReserveOrTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!primaryItem) return;
    setSubmitting(true);
    setOrderResult(null);
    try {
      const res = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: primaryItem.id,
          customerName,
          customerPhone,
          shippingAddress:
            method === 'IN_STORE_RESERVE'
              ? 'Mağazadan Elden Teslim'
              : shippingAddress,
          paymentMethod: method,
          notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setOrderResult({
          success: false,
          message: json.message || json.error || 'İşlem tamamlanamadı.',
        });
      } else {
        setOrderResult({
          success: true,
          orderNo: json.orderNo,
          message: json.message,
        });
        syncItems([]);
      }
    } catch {
      setOrderResult({
        success: false,
        message: 'Sunucu bağlantı hatası oluştu.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => {
          setStep('CART');
          setOrderResult(null);
          setIsOpen(true);
        },
        closeCart: closeDrawer,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
      }}
    >
      {children}

      {/* Slide-over Shopping Cart & Checkout Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l-4 border-red-600">
            {/* Drawer Header */}
            <div className="p-5 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {step === 'CHECKOUT' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep('CART');
                      setOrderResult(null);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                    aria-label="Sepete Dön"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    {step === 'CART'
                      ? 'Alışveriş Sepetim'
                      : 'Sipariş & Ödeme Seçenekleri'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {step === 'CART'
                      ? `${items.length} Adet Seçili Ürün`
                      : primaryItem?.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {orderResult ? (
                <div
                  className={`p-5 rounded-2xl border space-y-2 ${
                    orderResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm">
                    {orderResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span>
                      {orderResult.orderNo
                        ? `Kayıt No: ${orderResult.orderNo}`
                        : 'Bilgilendirme'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{orderResult.message}</p>
                </div>
              ) : step === 'CART' ? (
                items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-zinc-900 text-sm">
                        Sepetinizde henüz ürün bulunmuyor.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Go2Tek Mağaza stoklarındaki cihazları hemen inceleyebilirsiniz.
                      </p>
                    </div>
                    <Link
                      href="/magaza"
                      onClick={closeDrawer}
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
                          onClick={closeDrawer}
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
                )
              ) : (
                primaryItem && (
                  <div className="space-y-4">
                    {/* Marketplace Escrow Options (Shopier & Sahibinden Param Güvende) */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                        Güvenli Pazaryeri ile Satın Al
                      </div>

                      {primaryItem.shopierUrl ? (
                        <a
                          href={primaryItem.shopierUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full p-3.5 rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 hover:border-indigo-500 flex items-center justify-between gap-3 transition"
                        >
                          <div>
                            <div className="text-xs font-black text-indigo-950">
                              Shopier ile Kredi Kartı / Taksitli Al
                            </div>
                            <div className="text-[11px] text-indigo-700">
                              Shopier güvenli ödeme sayfasına yönlendirilirsiniz.
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" />
                        </a>
                      ) : (
                        <div className="w-full p-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-500 text-xs flex items-center justify-between">
                          <span>Shopier ile Satın Al</span>
                          <span className="text-[11px]">Link henüz eklenmedi</span>
                        </div>
                      )}

                      {primaryItem.sahibindenUrl ? (
                        <a
                          href={primaryItem.sahibindenUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full p-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50/70 hover:border-amber-500 flex items-center justify-between gap-3 transition"
                        >
                          <div>
                            <div className="text-xs font-black text-amber-950">
                              Sahibinden Param Güvende ile Al
                            </div>
                            <div className="text-[11px] text-amber-800">
                              Sahibinden Param Güvende ilan sayfasına yönlendirilirsiniz.
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-amber-700 shrink-0" />
                        </a>
                      ) : (
                        <div className="w-full p-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-500 text-xs flex items-center justify-between">
                          <span>Sahibinden Param Güvende</span>
                          <span className="text-[11px]">Link henüz eklenmedi</span>
                        </div>
                      )}
                    </div>

                    {/* Direct Reserve / In-Store Pickup or EFT */}
                    <div className="pt-3 border-t border-zinc-200 space-y-3">
                      <div className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                        Mağaza Rezervasyonu & Havale
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMethod('IN_STORE_RESERVE')}
                          className={`p-3 rounded-xl border-2 text-left transition flex items-start gap-2 ${
                            method === 'IN_STORE_RESERVE'
                              ? 'border-red-600 bg-red-50/50'
                              : 'border-zinc-200 bg-white'
                          }`}
                        >
                          <Store className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-extrabold text-zinc-900">
                              Elden Teslim Alacağım
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              Mağazada gör & rezerve et
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMethod('BANK_TRANSFER_EFT')}
                          className={`p-3 rounded-xl border-2 text-left transition flex items-start gap-2 ${
                            method === 'BANK_TRANSFER_EFT'
                              ? 'border-red-600 bg-red-50/50'
                              : 'border-zinc-200 bg-white'
                          }`}
                        >
                          <Building2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-extrabold text-zinc-900">
                              Havale / EFT
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              Dekont onaylı kargo
                            </div>
                          </div>
                        </button>
                      </div>

                      <form onSubmit={handleReserveOrTransfer} className="space-y-2.5">
                        <input
                          type="text"
                          required
                          placeholder="Adınız Soyadınız *"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Telefon Numaranız (05XX...) *"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs"
                        />
                        {method === 'BANK_TRANSFER_EFT' && (
                          <textarea
                            required
                            rows={2}
                            placeholder="Teslimat Adresiniz *"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs"
                          />
                        )}
                        <input
                          type="text"
                          placeholder={
                            method === 'IN_STORE_RESERVE'
                              ? 'Gelmek istediğiniz gün / saat notu (opsiyonel)'
                              : 'Sipariş notu (opsiyonel)'
                          }
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs"
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition disabled:opacity-50"
                        >
                          {submitting
                            ? 'Kaydediliyor...'
                            : method === 'IN_STORE_RESERVE'
                            ? 'Elden Teslim İçin Rezerve Et'
                            : 'Havale / EFT Siparişi Oluştur'}
                        </button>
                      </form>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && step === 'CART' && !orderResult && (
              <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-600">
                    Sepet Toplamı (KDV Dahil)
                  </span>
                  <span className="text-xl font-black text-zinc-900">
                    {totalAmount.toLocaleString('tr-TR')}{' '}
                    <span className="text-sm text-red-600">TL</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-700 bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-xl font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shopier • Sahibinden Param Güvende • Elden Teslim</span>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('CHECKOUT')}
                  className="w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition"
                >
                  Sipariş ve Ödeme Adımına Geç
                  <ArrowRight className="w-4 h-4" />
                </button>
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
