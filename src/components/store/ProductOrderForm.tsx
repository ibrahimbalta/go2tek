'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Store,
  Building2,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePublicSettings } from '@/context/SettingsContext';

export function ProductOrderForm({
  productId,
  productSlug,
  productSku,
  productBrand,
  productTitle,
  productImage,
  cosmeticCondition,
  shopierUrl,
  sahibindenUrl,
  price,
}: {
  productId: string;
  productSlug: string;
  productSku: string;
  productBrand: string;
  productTitle: string;
  productImage: string;
  cosmeticCondition: string;
  shopierUrl?: string | null;
  sahibindenUrl?: string | null;
  price: number;
}) {
  const { addToCart } = useCart();
  const { whatsappNumber } = usePublicSettings();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'IN_STORE_RESERVE' | 'BANK_TRANSFER_EFT'
  >('IN_STORE_RESERVE');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    orderNo?: string;
    paymentStatus?: string;
    message: string;
  } | null>(null);

  const whatsappText = encodeURIComponent(
    `Merhaba Go2Tek, "${productTitle}" (Stok Kodu: ${productSku} - Fiyat: ${price.toLocaleString(
      'tr-TR'
    )} TL) ürünü hakkında bilgi almak / satın almak istiyorum.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress:
            paymentMethod === 'IN_STORE_RESERVE'
              ? 'Mağazadan Elden Teslim'
              : shippingAddress,
          paymentMethod,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({
          success: false,
          paymentStatus: data.paymentStatus,
          message: data.message || data.error || 'İşlem tamamlanamadı.',
        });
      } else {
        setResult({
          success: true,
          orderNo: data.orderNo,
          paymentStatus: data.paymentStatus,
          message: data.message,
        });
      }
    } catch {
      setResult({
        success: false,
        message: 'Sunucu bağlantı hatası oluştu.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {!open ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe57] text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              WhatsApp ile Sor / Al
            </a>

            <button
              type="button"
              onClick={() =>
                addToCart({
                  id: productId,
                  slug: productSlug,
                  sku: productSku,
                  title: productTitle,
                  brand: productBrand,
                  price,
                  image: productImage,
                  cosmeticCondition,
                  shopierUrl,
                  sahibindenUrl,
                })
              }
              className="py-4 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-sm transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5 text-red-500" />
              Sepete Ekle
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="py-4 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Hemen Sipariş Ver
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 text-center font-medium">
            Shopier • Sahibinden Param Güvende • Elden Teslim Rezervasyon
          </p>
        </div>
      ) : (
        <div className="bg-zinc-50 rounded-2xl p-5 border-2 border-red-600/40 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <h4 className="font-black text-zinc-900 text-sm">
              Satın Alma ve Rezervasyon Seçenekleri
            </h4>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-zinc-500 hover:text-red-600"
            >
              Kapat
            </button>
          </div>

          {/* Shopier & Sahibinden Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {shopierUrl ? (
              <a
                href={shopierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border-2 border-indigo-200 bg-indigo-50/70 hover:border-indigo-500 flex items-center justify-between gap-2 transition"
              >
                <span className="text-xs font-extrabold text-indigo-950">
                  Shopier ile Satın Al
                </span>
                <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" />
              </a>
            ) : (
              <div className="p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-400 flex items-center justify-between">
                <span>Shopier ile Al</span>
                <span className="text-[11px]">Link eklenmedi</span>
              </div>
            )}

            {sahibindenUrl ? (
              <a
                href={sahibindenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border-2 border-amber-300 bg-amber-50/70 hover:border-amber-500 flex items-center justify-between gap-2 transition"
              >
                <span className="text-xs font-extrabold text-amber-950">
                  Sahibinden Param Güvende
                </span>
                <ExternalLink className="w-4 h-4 text-amber-700 shrink-0" />
              </a>
            ) : (
              <div className="p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-400 flex items-center justify-between">
                <span>Sahibinden Param Güvende</span>
                <span className="text-[11px]">Link eklenmedi</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-zinc-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('IN_STORE_RESERVE')}
                className={`p-3 rounded-xl border-2 text-left transition flex items-start gap-2.5 ${
                  paymentMethod === 'IN_STORE_RESERVE'
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                <Store className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-zinc-900">
                    Elden Teslim Alacağım (Rezerve Et)
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Mağazada inceleyerek teslim alın.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BANK_TRANSFER_EFT')}
                className={`p-3 rounded-xl border-2 text-left transition flex items-start gap-2.5 ${
                  paymentMethod === 'BANK_TRANSFER_EFT'
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-zinc-900">
                    Kurumsal Havale / EFT
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Dekont doğrulamalı kargo siparişi.
                  </div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Adınız Soyadınız *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm"
              />
              <input
                type="tel"
                required
                placeholder="Telefon Numaranız (05XX...) *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm"
              />
            </div>

            <input
              type="email"
              placeholder="E-posta Adresiniz (Opsiyonel)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm"
            />

            {paymentMethod === 'BANK_TRANSFER_EFT' && (
              <textarea
                required
                rows={2}
                placeholder="Açık Teslimat Adresiniz *"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm"
              />
            )}

            <input
              type="text"
              placeholder={
                paymentMethod === 'IN_STORE_RESERVE'
                  ? 'Gelmek istediğiniz gün / saat notu (opsiyonel)'
                  : 'Sipariş notu (opsiyonel)'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm"
            />

            {result && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1 ${
                  result.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    {result.orderNo
                      ? `Kayıt No: ${result.orderNo} (${result.paymentStatus})`
                      : `Durum: ${result.paymentStatus || 'Bilgilendirme'}`}
                  </span>
                </div>
                <p className="leading-relaxed">{result.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition disabled:opacity-50"
            >
              {loading
                ? 'İşleniyor...'
                : paymentMethod === 'IN_STORE_RESERVE'
                ? 'Elden Teslim İçin Rezerve Et'
                : 'Havale / EFT Siparişini Başlat'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
