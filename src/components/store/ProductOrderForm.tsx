'use client';

import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ProductOrderForm({
  productId,
  productTitle,
  price,
}: {
  productId: string;
  productTitle: string;
  price: number;
}) {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'BANK_TRANSFER_EFT' | 'PAYMENT_GATEWAY_IYZICO'
  >('BANK_TRANSFER_EFT');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    orderNo?: string;
    paymentStatus?: string;
    message: string;
  } | null>(null);

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
          shippingAddress,
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
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Go2Tek Güvencesiyle Satın Al / Sipariş Oluştur ({price.toLocaleString('tr-TR')} TL)
          </button>
          <p className="text-[11px] text-slate-500 text-center">
            Ödeme kuruluşu (iyzico/PayTR) altyapısı ve Kurumsal Havale/EFT doğrulaması ile güvenli işlem.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Satın Alma Seçenekleri: {productTitle}
            </h4>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Kapat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('BANK_TRANSFER_EFT')}
              className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                paymentMethod === 'BANK_TRANSFER_EFT'
                  ? 'border-blue-600 bg-blue-50/60'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Kurumsal Havale / EFT (Ön Sipariş & Dekont Doğrulamalı)
                </div>
                <div className="text-[11px] text-slate-500">
                  Dekont referansı finans birimince onaylandığında kargolanır.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('PAYMENT_GATEWAY_IYZICO')}
              className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                paymentMethod === 'PAYMENT_GATEWAY_IYZICO'
                  ? 'border-blue-600 bg-blue-50/60'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Yetkili Ödeme Kuruluşu (iyzico / PayTR 3D Secure)
                </div>
                <div className="text-[11px] text-slate-500">
                  Canlı API anahtarı olmadan sahte onay verilmez.
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
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
            />
            <input
              type="tel"
              required
              placeholder="Telefon Numaranız (05XX...) *"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
            />
          </div>

          <input
            type="email"
            placeholder="E-posta Adresiniz (Fatura & Bilgilendirme)"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
          />

          <textarea
            required
            rows={2}
            placeholder="Açık Teslimat Adresiniz *"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
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
                    ? `Sipariş Kayıt No: ${result.orderNo} (${result.paymentStatus})`
                    : `Durum: ${result.paymentStatus || 'Bilgilendirme'}`}
                </span>
              </div>
              <p className="leading-relaxed">{result.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition disabled:opacity-50"
          >
            {loading ? 'İşleniyor...' : 'Sipariş / Ödeme Adımını Başlat'}
          </button>
        </form>
      )}
    </div>
  );
}
