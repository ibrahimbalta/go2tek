'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, Plus, Search, Eye, EyeOff, Upload, Video } from 'lucide-react';
import { PRODUCT_CATEGORIES, COSMETIC_LABELS } from '@/lib/constants';
import { uploadMediaFile } from '@/lib/client-upload';
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

interface ProductForm {
  id?: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  cpu: string;
  ram: string;
  ramGb: number;
  storage: string;
  storageGb: number;
  gpu: string;
  screenSize: string;
  cosmeticCondition: string;
  batteryHealth: string;
  price: number;
  stockStatus: string;
  warrantyInfo: string;
  technicalCheckSummary: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  shopierUrl: string;
  sahibindenUrl: string;
  isPublished: boolean;
}

const EMPTY: ProductForm = {
  title: '',
  category: 'NOTEBOOK',
  brand: '',
  model: '',
  cpu: '',
  ram: '16 GB',
  ramGb: 16,
  storage: '512 GB SSD',
  storageGb: 512,
  gpu: '',
  screenSize: '',
  cosmeticCondition: 'A',
  batteryHealth: '',
  price: 0,
  stockStatus: 'IN_STOCK',
  warrantyInfo: 'Mağaza Kontrolü Yapılmış',
  technicalCheckSummary: '',
  description: '',
  imageUrl: '',
  videoUrl: '',
  shopierUrl: '',
  sahibindenUrl: '',
  isPublished: true,
};

const STOCK_LABELS: Record<string, { label: string; tone: 'green' | 'amber' | 'red' | 'zinc' }> = {
  IN_STOCK: { label: 'Stokta', tone: 'green' },
  RESERVED: { label: 'Rezerve', tone: 'amber' },
  SOLD: { label: 'Satıldı', tone: 'red' },
  OUT_OF_STOCK: { label: 'Tükendi', tone: 'zinc' },
};

function firstImage(images: string): string {
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed[0]) return parsed[0];
  } catch {
    // yoksay
  }
  return '/images/products/macbook-pro-14.svg';
}

export function ProductsPanel({ data, reload, notify }: PanelProps) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: any[] = data.products;
  const filtered = products.filter((p) => {
    if (catFilter !== 'ALL' && p.category !== catFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [p.title, p.brand, p.model, p.sku].some((v: string) =>
      String(v).toLowerCase().includes(q)
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEdit(p: any) {
    setEditing({
      id: p.id,
      title: p.title,
      category: p.category,
      brand: p.brand,
      model: p.model,
      cpu: p.cpu,
      ram: p.ram,
      ramGb: p.ramGb,
      storage: p.storage,
      storageGb: p.storageGb,
      gpu: p.gpu,
      screenSize: p.screenSize,
      cosmeticCondition: p.cosmeticCondition,
      batteryHealth: p.batteryHealth,
      price: p.price,
      stockStatus: p.stockStatus,
      warrantyInfo: p.warrantyInfo,
      technicalCheckSummary: p.technicalCheckSummary,
      description: p.description,
      imageUrl: firstImage(p.images),
      videoUrl: p.videoUrl || '',
      shopierUrl: p.shopierUrl || '',
      sahibindenUrl: p.sahibindenUrl || '',
      isPublished: p.isPublished,
    });
  }

  function set<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await uploadMediaFile(file, 'image');
      if (!result.ok || !result.url) {
        setUploadError(result.error || 'Görsel yüklenemedi.');
      } else {
        set('imageUrl', result.url);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setUploadError('');
    try {
      const result = await uploadMediaFile(file, 'video');
      if (!result.ok || !result.url) {
        setUploadError(result.error || 'Video yüklenemedi.');
      } else {
        set('videoUrl', result.url);
      }
    } finally {
      setUploadingVideo(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const { ok, json } = await apiCall(
      isNew ? '/api/admin/products' : `/api/admin/products/${editing.id}`,
      isNew ? 'POST' : 'PATCH',
      editing
    );
    setSaving(false);
    if (!ok) {
      notify('error', String(json.error || 'Ürün kaydedilemedi.'));
      return;
    }
    notify('success', isNew ? 'Yeni ürün mağazaya eklendi.' : 'Ürün güncellendi.');
    setEditing(null);
    await reload();
  }

  async function quickToggle(id: string, patch: Record<string, unknown>, msg: string) {
    const { ok, json } = await apiCall(`/api/admin/products/${id}`, 'PATCH', patch);
    if (!ok) notify('error', String(json.error || 'İşlem başarısız.'));
    else {
      notify('success', msg);
      await reload();
    }
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`"${title}" ürünü kalıcı olarak silinsin mi?`)) return;
    const { ok, json } = await apiCall(`/api/admin/products/${id}`, 'DELETE');
    if (!ok) notify('error', String(json.error || 'Ürün silinemedi.'));
    else {
      notify('success', 'Ürün silindi.');
      await reload();
    }
  }

  return (
    <>
      <Card
        title={`Ürün Yönetimi (${products.length})`}
        description="Mağazada görünen tüm ürünleri buradan ekleyin, düzenleyin, yayından kaldırın veya silin."
        actions={
          <button type="button" className={btnPrimary} onClick={() => setEditing({ ...EMPTY })}>
            <Plus className="w-4 h-4" /> Yeni Ürün Ekle
          </button>
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün adı, marka, model veya stok kodu ara..."
              className={`${inputCls} pl-10`}
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className={`${inputCls} sm:w-56`}
          >
            <option value="ALL">Tüm Kategoriler</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100">
                <th className="px-5 sm:px-6 py-2.5 font-semibold">Ürün</th>
                <th className="px-3 py-2.5 font-semibold">Kategori</th>
                <th className="px-3 py-2.5 font-semibold">Fiyat</th>
                <th className="px-3 py-2.5 font-semibold">Stok</th>
                <th className="px-3 py-2.5 font-semibold">Yayın</th>
                <th className="px-5 sm:px-6 py-2.5 font-semibold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((p) => {
                const stock = STOCK_LABELS[p.stockStatus] || STOCK_LABELS.IN_STOCK;
                const cat = PRODUCT_CATEGORIES.find((c) => c.key === p.category);
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/70">
                    <td className="px-5 sm:px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={firstImage(p.images)}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-900 truncate max-w-xs">
                            {p.title}
                          </div>
                          <div className="text-xs text-zinc-400">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-zinc-600">{cat?.shortLabel || p.category}</td>
                    <td className="px-3 py-3 font-semibold text-zinc-900">
                      {p.price.toLocaleString('tr-TR')} TL
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={p.stockStatus}
                        onChange={(e) =>
                          quickToggle(p.id, { stockStatus: e.target.value }, 'Stok durumu güncellendi.')
                        }
                        className="text-xs rounded-lg border border-zinc-200 bg-white px-2 py-1.5"
                      >
                        <option value="IN_STOCK">Stokta</option>
                        <option value="RESERVED">Rezerve</option>
                        <option value="SOLD">Satıldı</option>
                        <option value="OUT_OF_STOCK">Tükendi</option>
                      </select>
                      <span className="sr-only">
                        <StatusBadge label={stock.label} tone={stock.tone} />
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          quickToggle(
                            p.id,
                            { isPublished: !p.isPublished },
                            p.isPublished ? 'Ürün yayından kaldırıldı.' : 'Ürün yayına alındı.'
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                      >
                        {p.isPublished ? (
                          <>
                            <Eye className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700">Yayında</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-zinc-400" />
                            <span className="text-zinc-500">Gizli</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 sm:px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" className={btnGhost + ' !px-3 !py-2 !text-xs'} onClick={() => openEdit(p)}>
                          <Pencil className="w-3.5 h-3.5" /> Düzenle
                        </button>
                        <button type="button" className={btnDanger} onClick={() => remove(p.id, p.title)}>
                          <Trash2 className="w-3.5 h-3.5" /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-zinc-400">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <Modal
          wide
          title={editing.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ürün Başlığı *" className="sm:col-span-2">
                <input required value={editing.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Kategori">
                <select value={editing.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Satış Fiyatı (TL) *">
                <input required type="number" min={0} value={editing.price} onChange={(e) => set('price', Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Marka *">
                <input required value={editing.brand} onChange={(e) => set('brand', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Model">
                <input value={editing.model} onChange={(e) => set('model', e.target.value)} className={inputCls} />
              </Field>
              <Field label="İşlemci">
                <input value={editing.cpu} onChange={(e) => set('cpu', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Ekran Kartı">
                <input value={editing.gpu} onChange={(e) => set('gpu', e.target.value)} className={inputCls} />
              </Field>
              <Field label="RAM (metin)">
                <input value={editing.ram} onChange={(e) => set('ram', e.target.value)} className={inputCls} />
              </Field>
              <Field label="RAM (GB, filtre için)">
                <input type="number" min={0} value={editing.ramGb} onChange={(e) => set('ramGb', Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Depolama (metin)">
                <input value={editing.storage} onChange={(e) => set('storage', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Depolama (GB)">
                <input type="number" min={0} value={editing.storageGb} onChange={(e) => set('storageGb', Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Ekran Boyutu">
                <input value={editing.screenSize} onChange={(e) => set('screenSize', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Pil Sağlığı / Güç Bilgisi">
                <input value={editing.batteryHealth} onChange={(e) => set('batteryHealth', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Kozmetik Durum">
                <select value={editing.cosmeticCondition} onChange={(e) => set('cosmeticCondition', e.target.value)} className={inputCls}>
                  <option value="A_PLUS">{COSMETIC_LABELS.A_PLUS}</option>
                  <option value="A">{COSMETIC_LABELS.A}</option>
                  <option value="B">{COSMETIC_LABELS.B}</option>
                  <option value="C">{COSMETIC_LABELS.C}</option>
                </select>
              </Field>
              <Field label="Stok Durumu">
                <select value={editing.stockStatus} onChange={(e) => set('stockStatus', e.target.value)} className={inputCls}>
                  <option value="IN_STOCK">Stokta</option>
                  <option value="RESERVED">Rezerve</option>
                  <option value="SOLD">Satıldı</option>
                  <option value="OUT_OF_STOCK">Tükendi</option>
                </select>
              </Field>
              <Field label="Garanti / Durum Bilgisi" className="sm:col-span-2">
                <input value={editing.warrantyInfo} onChange={(e) => set('warrantyInfo', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Kontrol Notları" className="sm:col-span-2">
                <textarea rows={2} value={editing.technicalCheckSummary} onChange={(e) => set('technicalCheckSummary', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Ürün Açıklaması" className="sm:col-span-2">
                <textarea rows={3} value={editing.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Ürün Görseli (adres veya yükle)" className="sm:col-span-2">
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <input value={editing.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://... veya /uploads/..." className={inputCls} />
                  <label className={btnGhost + ' cursor-pointer shrink-0'}>
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" />
                  </label>
                </div>
                {editing.imageUrl && (
                  <img src={editing.imageUrl} alt="" className="mt-3 h-28 rounded-xl object-cover border border-zinc-200" />
                )}
              </Field>
              <Field
                label="Cihaz Videosu (MP4/WebM yükle veya YouTube / Video bağlantısı)"
                hint="Kısa tanıtım videosu yükleyebilir veya YouTube linki yapıştırabilirsiniz."
                className="sm:col-span-2"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <input value={editing.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=... veya /uploads/video-..." className={inputCls} />
                  <label className={btnGhost + ' cursor-pointer shrink-0'}>
                    <Video className="w-4 h-4 text-red-600" />
                    {uploadingVideo ? 'Yükleniyor...' : 'Video Yükle'}
                    <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} className="hidden" />
                  </label>
                </div>
                {editing.videoUrl && !editing.videoUrl.includes('youtube.com') && !editing.videoUrl.includes('youtu.be') && (
                  <video src={editing.videoUrl} controls className="mt-3 h-36 rounded-xl border border-zinc-200 bg-black" />
                )}
                {uploadError && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    {uploadError}
                  </p>
                )}
              </Field>
              <Field
                label="Shopier Satın Alma Linki"
                hint="Müşteri 'Shopier ile Al' seçeneğine tıkladığında bu linke yönlendirilir."
              >
                <input
                  value={editing.shopierUrl}
                  onChange={(e) => set('shopierUrl', e.target.value)}
                  placeholder="https://www.shopier.com/..."
                  className={inputCls}
                />
              </Field>
              <Field
                label="Sahibinden Param Güvende Linki"
                hint="Müşteri 'Sahibinden Param Güvende' seçeneğine tıkladığında bu ilana yönlendirilir."
              >
                <input
                  value={editing.sahibindenUrl}
                  onChange={(e) => set('sahibindenUrl', e.target.value)}
                  placeholder="https://www.sahibinden.com/ilan/..."
                  className={inputCls}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2.5 text-sm font-medium text-zinc-700">
              <input type="checkbox" checked={editing.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="rounded border-zinc-300 text-red-600" />
              Mağazada yayınla
            </label>

            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-100">
              <button type="button" className={btnGhost} onClick={() => setEditing(null)}>
                Vazgeç
              </button>
              <button type="submit" disabled={saving} className={btnPrimary}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
