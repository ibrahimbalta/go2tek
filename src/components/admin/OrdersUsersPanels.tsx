'use client';

import React, { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { Card, Field, StatusBadge, apiCall, btnDanger, btnPrimary, inputCls, PanelProps } from './ui';

const PAYMENT_STATUSES: Array<[string, string, 'zinc' | 'red' | 'green' | 'amber' | 'blue']> = [
  ['PENDING_VERIFICATION', 'Doğrulama Bekliyor', 'amber'],
  ['GATEWAY_NOT_CONFIGURED', 'Ödeme Altyapısı Yok', 'zinc'],
  ['VERIFIED_PAID', 'Ödeme Doğrulandı', 'green'],
  ['CANCELLED', 'İptal', 'red'],
];

export function OrdersPanel({ data, reload, notify }: PanelProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders: any[] = data.storeOrders;
  const [refs, setRefs] = useState<Record<string, string>>({});

  async function update(id: string, patch: Record<string, unknown>, msg: string) {
    const { ok, json } = await apiCall(`/api/admin/orders/${id}`, 'PATCH', patch);
    if (!ok) notify('error', String(json.error || 'Sipariş güncellenemedi.'));
    else {
      notify('success', msg);
      await reload();
    }
  }

  async function changeStatus(o: { id: string; gatewayReference: string }, status: string) {
    const ref = (refs[o.id] ?? o.gatewayReference ?? '').trim();
    if (status === 'VERIFIED_PAID' && ref.length < 4) {
      notify(
        'error',
        'Ödemeyi doğrulanmış olarak işaretlemek için ödeme kuruluşu veya banka dekont referans numarası girin.'
      );
      return;
    }
    await update(o.id, { paymentStatus: status, gatewayReference: ref }, 'Sipariş durumu güncellendi.');
  }

  async function remove(id: string, no: string) {
    if (!window.confirm(`${no} siparişi silinsin mi?`)) return;
    const { ok } = await apiCall(`/api/admin/orders/${id}`, 'DELETE');
    if (!ok) notify('error', 'Sipariş silinemedi.');
    else {
      notify('success', 'Sipariş silindi.');
      await reload();
    }
  }

  return (
    <Card
      title={`Mağaza Siparişleri (${orders.length})`}
      description="Ödeme, dekont veya ödeme kuruluşu referansı girilmeden sipariş 'Ödeme Doğrulandı' yapılamaz."
    >
      <div className="space-y-3">
        {orders.map((o) => {
          const st = PAYMENT_STATUSES.find(([k]) => k === o.paymentStatus);
          return (
            <div key={o.id} className="rounded-xl border border-zinc-200 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md">{o.orderNo}</span>
                  <StatusBadge label={st?.[1] || o.paymentStatus} tone={st?.[2] || 'zinc'} />
                  <span className="text-xs text-zinc-400">{new Date(o.createdAt).toLocaleString('tr-TR')}</span>
                </div>
                <div className="text-sm font-bold text-zinc-900">{o.amount.toLocaleString('tr-TR')} TL</div>
              </div>
              <div className="text-sm text-zinc-800 font-medium">{o.product?.title}</div>
              <div className="text-xs text-zinc-600">
                {o.customerName} • {o.customerPhone} • {o.customerEmail || 'E-posta yok'} • {o.shippingAddress}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <input
                  value={refs[o.id] ?? o.gatewayReference ?? ''}
                  onChange={(e) => setRefs((p) => ({ ...p, [o.id]: e.target.value }))}
                  placeholder="Dekont / ödeme kuruluşu referans no"
                  className={inputCls}
                />
                <select
                  value={o.paymentStatus}
                  onChange={(e) => changeStatus(o, e.target.value)}
                  className={`${inputCls} sm:w-60`}
                >
                  {PAYMENT_STATUSES.map(([k, l]) => (
                    <option key={k} value={k}>{l}</option>
                  ))}
                </select>
                <button type="button" className={btnDanger} onClick={() => remove(o.id, o.orderNo)}>
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="py-10 text-center text-sm text-zinc-400">Henüz mağaza siparişi bulunmuyor.</div>
        )}
      </div>
    </Card>
  );
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Genel Yönetici',
  SALES_STAFF: 'Satış & Eşleştirme',
  TECHNICAL_STAFF: 'Teknik Kontrol',
  FINANCE_STAFF: 'Finans',
};

export function UsersPanel({ data, reload, notify }: PanelProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users: any[] = data.users || [];
  const isAdmin = data.session.role === 'ADMIN';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SALES_STAFF' });
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { ok, json } = await apiCall('/api/admin/users', 'POST', form);
    setSaving(false);
    if (!ok) notify('error', String(json.error || 'Personel kaydedilemedi.'));
    else {
      notify('success', 'Personel kaydedildi.');
      setForm({ name: '', email: '', password: '', role: 'SALES_STAFF' });
      await reload();
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Card title={`Yönetici ve Personel (${users.length})`} description="Panele giriş yapabilen hesaplar.">
          <div className="divide-y divide-zinc-100">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{u.name}</div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </div>
                <StatusBadge label={ROLE_LABELS[u.role] || u.role} tone={u.role === 'ADMIN' ? 'red' : 'blue'} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card title="Personel Ekle / Şifre Güncelle" description="Aynı e-posta girilirse hesap güncellenir.">
          {isAdmin ? (
            <form onSubmit={add} className="space-y-4">
              <Field label="Ad Soyad">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="E-posta">
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Şifre">
                <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Rol">
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                  {Object.entries(ROLE_LABELS).map(([k, l]) => (
                    <option key={k} value={k}>{l}</option>
                  ))}
                </select>
              </Field>
              <button type="submit" disabled={saving} className={btnPrimary + ' w-full'}>
                <UserPlus className="w-4 h-4" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-zinc-500">Personel eklemek için Genel Yönetici yetkisi gerekir.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
