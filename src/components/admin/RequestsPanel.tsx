'use client';

import React, { useState } from 'react';
import { Search, Phone, Trash2, Pencil, ShoppingBag } from 'lucide-react';
import { PRODUCT_CATEGORIES, COSMETIC_LABELS } from '@/lib/constants';
import {
  Card,
  Field,
  Modal,
  StatusBadge,
  apiCall,
  btnDanger,
  btnGhost,
  btnPrimary,
  inputCls,
  PanelProps,
} from './ui';

const BUYER_STATUS = [
  ['NEW', 'Yeni'],
  ['REVIEWING', 'İnceleniyor'],
  ['MATCHED', 'Eşleştirildi'],
  ['COMPLETED', 'Tamamlandı'],
  ['CANCELLED', 'İptal'],
];

const SELLER_STATUS = [
  ['NEW', 'Yeni'],
  ['REVIEWING', 'İnceleniyor'],
  ['MATCHED', 'Eşleştirildi'],
  ['PURCHASED', 'Satın Alındı'],
  ['REJECTED', 'Reddedildi'],
  ['CANCELLED', 'İptal'],
];

function toneFor(status: string): 'zinc' | 'red' | 'green' | 'amber' | 'blue' {
  if (status === 'NEW') return 'blue';
  if (status === 'REVIEWING') return 'amber';
  if (['MATCHED', 'COMPLETED', 'PURCHASED'].includes(status)) return 'green';
  if (['CANCELLED', 'REJECTED'].includes(status)) return 'red';
  return 'zinc';
}

function firstPhoto(photos: string): string {
  try {
    const parsed = JSON.parse(photos);
    if (Array.isArray(parsed) && parsed[0]) return parsed[0];
  } catch {
    // yoksay
  }
  return '/images/products/macbook-pro-14.svg';
}

export function RequestsPanel({
  type,
  data,
  reload,
  notify,
}: PanelProps & { type: 'BUYER' | 'SELLER' }) {
  const isBuyer = type === 'BUYER';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = isBuyer ? data.buyerRequests : data.sellerOffers;
  const statuses = isBuyer ? BUYER_STATUS : SELLER_STATUS;

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = rows.filter((r) => {
    if (catFilter !== 'ALL' && r.category !== catFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [r.referenceNo, r.fullName, r.phone, r.brand, r.model, r.brandPref, r.cpuPref]
      .filter(Boolean)
      .some((v: string) => String(v).toLowerCase().includes(q));
  });

  async function quickStatus(id: string, status: string) {
    const { ok, json } = await apiCall(`/api/admin/requests/${id}`, 'PATCH', { type, status });
    if (!ok) notify('error', String(json.error || 'Durum güncellenemedi.'));
    else {
      notify('success', 'Durum güncellendi.');
      await reload();
    }
  }

  async function remove(id: string, ref: string) {
    if (!window.confirm(`${ref} kaydı ve bağlı eşleştirmeleri kalıcı olarak silinsin mi?`)) return;
    const { ok, json } = await apiCall(`/api/admin/requests/${id}?type=${type}`, 'DELETE');
    if (!ok) notify('error', String(json.error || 'Kayıt silinemedi.'));
    else {
      notify('success', 'Kayıt silindi.');
      await reload();
    }
  }

  async function convert(id: string, requestedPrice: number) {
    const input = window.prompt(
      'Mağazada satılacak fiyatı (TL) girin:',
      String(Math.round(requestedPrice * 1.12))
    );
    if (!input) return;
    const salePrice = Number(input);
    if (!salePrice || salePrice <= 0) return notify('error', 'Geçerli bir fiyat girin.');
    const { ok, json } = await apiCall(`/api/admin/requests/${id}`, 'PATCH', {
      type: 'SELLER',
      convertToProduct: true,
      salePrice,
    });
    if (!ok) notify('error', String(json.error || 'Mağazaya eklenemedi.'));
    else {
      notify('success', 'Cihaz mağaza ürünü olarak yayına alındı. Ürünler bölümünden düzenleyebilirsiniz.');
      await reload();
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const { ok, json } = await apiCall(`/api/admin/requests/${editing.id}`, 'PATCH', {
      type,
      ...editing,
    });
    setSaving(false);
    if (!ok) notify('error', String(json.error || 'Kayıt güncellenemedi.'));
    else {
      notify('success', 'Kayıt güncellendi.');
      setEditing(null);
      await reload();
    }
  }

  function setField(key: string, value: string | number) {
    setEditing((prev: Record<string, unknown> | null) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <>
      <Card
        title={isBuyer ? `Alıcı Talepleri (${rows.length})` : `Satıcı Teklifleri (${rows.length})`}
        description={
          isBuyer
            ? 'Bu talepler herkese açık yayınlanmaz; yalnızca yönetim panelinde görünür.'
            : 'Bu teklifler herkese açık yayınlanmaz. Uygun cihazları tek tıkla mağazaya aktarabilirsiniz.'
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Başvuru no, ad, telefon, marka ara..." className={`${inputCls} pl-10`} />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={inputCls}>
            <option value="ALL">Tüm Kategoriler</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls}>
            <option value="ALL">Tüm Durumlar</option>
            {statuses.map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border border-zinc-200 p-4 sm:p-5 hover:border-zinc-300 transition">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                  {!isBuyer && (
                    <img src={firstPhoto(r.photos)} alt="" className="w-20 h-16 rounded-lg object-cover bg-zinc-100 shrink-0" />
                  )}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md">{r.referenceNo}</span>
                      <StatusBadge label={statuses.find(([k]) => k === r.status)?.[1] || r.status} tone={toneFor(r.status)} />
                      <span className="text-xs text-zinc-400">{new Date(r.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {isBuyer ? (
                      <>
                        <div className="text-sm font-semibold text-zinc-900">
                          {PRODUCT_CATEGORIES.find((c) => c.key === r.category)?.shortLabel} • Bütçe {r.minBudget.toLocaleString('tr-TR')} - {r.maxBudget.toLocaleString('tr-TR')} TL
                        </div>
                        <div className="text-xs text-zinc-600">
                          Marka: {r.brandPref} • CPU: {r.cpuPref} • RAM: {r.ramPref} • Depolama: {r.storagePref} • GPU: {r.gpuPref} • Kozmetik: {COSMETIC_LABELS[r.cosmeticPref] || r.cosmeticPref}
                        </div>
                        <div className="text-xs text-zinc-500">Amaç: {r.usagePurpose}{r.additionalNotes ? ` — ${r.additionalNotes}` : ''}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-zinc-900">
                          {r.brand} {r.model} • İstenen {r.requestedPrice.toLocaleString('tr-TR')} TL
                        </div>
                        <div className="text-xs text-zinc-600">
                          {r.cpu} • {r.ram} • {r.storage} • {r.gpu} • Kozmetik: {COSMETIC_LABELS[r.cosmeticCondition] || r.cosmeticCondition} • Pil: {r.batteryHealth}
                        </div>
                        <div className="text-xs text-zinc-500">
                          Seri No: {r.rawSerialNumber ?? r.serialNumber} • Arızalar: {r.knownDefects}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end shrink-0">
                  <div className="text-xs">
                    <div className="font-semibold text-zinc-900 lg:text-right">{r.fullName}</div>
                    <div className="inline-flex items-center gap-1.5 text-red-600 font-semibold">
                      <Phone className="w-3.5 h-3.5" /> {r.phone}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select value={r.status} onChange={(e) => quickStatus(r.id, e.target.value)} className="text-xs rounded-lg border border-zinc-200 bg-white px-2 py-2">
                      {statuses.map(([k, l]) => (
                        <option key={k} value={k}>{l}</option>
                      ))}
                    </select>
                    <button type="button" className={btnGhost + ' !px-3 !py-2 !text-xs'} onClick={() => setEditing({ ...r })}>
                      <Pencil className="w-3.5 h-3.5" /> Düzenle
                    </button>
                    {!isBuyer && (
                      <button type="button" className={btnGhost + ' !px-3 !py-2 !text-xs'} onClick={() => convert(r.id, r.requestedPrice)}>
                        <ShoppingBag className="w-3.5 h-3.5" /> Mağazaya Ekle
                      </button>
                    )}
                    <button type="button" className={btnDanger} onClick={() => remove(r.id, r.referenceNo)}>
                      <Trash2 className="w-3.5 h-3.5" /> Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-400">Kayıt bulunamadı.</div>
          )}
        </div>
      </Card>

      {editing && (
        <Modal title={`${editing.referenceNo} Düzenle`} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ad Soyad">
                <input value={editing.fullName} onChange={(e) => setField('fullName', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Telefon">
                <input value={editing.phone} onChange={(e) => setField('phone', e.target.value)} className={inputCls} />
              </Field>
              {isBuyer ? (
                <>
                  <Field label="Minimum Bütçe (TL)">
                    <input type="number" value={editing.minBudget} onChange={(e) => setField('minBudget', Number(e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Maksimum Bütçe (TL)">
                    <input type="number" value={editing.maxBudget} onChange={(e) => setField('maxBudget', Number(e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Marka Tercihi">
                    <input value={editing.brandPref} onChange={(e) => setField('brandPref', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="İşlemci Tercihi">
                    <input value={editing.cpuPref} onChange={(e) => setField('cpuPref', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="RAM Tercihi">
                    <input value={editing.ramPref} onChange={(e) => setField('ramPref', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Depolama Tercihi">
                    <input value={editing.storagePref} onChange={(e) => setField('storagePref', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Ek Notlar" className="sm:col-span-2">
                    <textarea rows={2} value={editing.additionalNotes} onChange={(e) => setField('additionalNotes', e.target.value)} className={inputCls} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="İstenen Fiyat (TL)">
                    <input type="number" value={editing.requestedPrice} onChange={(e) => setField('requestedPrice', Number(e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Marka">
                    <input value={editing.brand} onChange={(e) => setField('brand', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Model">
                    <input value={editing.model} onChange={(e) => setField('model', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="İşlemci">
                    <input value={editing.cpu} onChange={(e) => setField('cpu', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="RAM">
                    <input value={editing.ram} onChange={(e) => setField('ram', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Depolama">
                    <input value={editing.storage} onChange={(e) => setField('storage', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Ekran Kartı">
                    <input value={editing.gpu} onChange={(e) => setField('gpu', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Pil Sağlığı">
                    <input value={editing.batteryHealth} onChange={(e) => setField('batteryHealth', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Bilinen Arızalar" className="sm:col-span-2">
                    <input value={editing.knownDefects} onChange={(e) => setField('knownDefects', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Açıklama" className="sm:col-span-2">
                    <textarea rows={2} value={editing.description} onChange={(e) => setField('description', e.target.value)} className={inputCls} />
                  </Field>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-100">
              <button type="button" className={btnGhost} onClick={() => setEditing(null)}>Vazgeç</button>
              <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
