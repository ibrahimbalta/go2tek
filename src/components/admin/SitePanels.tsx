'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Card, Field, apiCall, btnDanger, btnGhost, btnPrimary, inputCls, PanelProps } from './ui';

/* ------------------------------------------------------------------ */
/* Genel Site Ayarları                                                 */
/* ------------------------------------------------------------------ */

export function SitePanel({ data, reload, notify }: PanelProps) {
  const [form, setForm] = useState({ ...data.siteSettings });
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string) {
    setForm((prev: Record<string, string>) => ({ ...prev, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { ok, json } = await apiCall('/api/admin/site-config', 'PUT', {
      siteSettings: form,
    });
    setSaving(false);
    if (!ok) notify('error', String(json.error || 'Ayarlar kaydedilemedi.'));
    else {
      notify('success', 'Site ayarları kaydedildi. Değişiklikler sitede yayında.');
      await reload();
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <Card
        title="İletişim ve Mağaza Bilgileri"
        description="Üst bar, alt bilgi, iletişim sayfası ve WhatsApp butonlarında kullanılır."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Telefon">
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
          </Field>
          <Field label="WhatsApp Numarası" hint="Başında + olmadan, ülke koduyla. Örn: 905325502026">
            <input value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value.replace(/\D/g, ''))} className={inputCls} />
          </Field>
          <Field label="E-posta">
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Çalışma Saatleri">
            <input value={form.workingHours} onChange={(e) => set('workingHours', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Adres" className="sm:col-span-2">
            <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card
        title="Site Metinleri"
        description="Üst bar, alt bilgi ve ana sayfadaki tanıtım alanı metinleri."
      >
        <div className="grid grid-cols-1 gap-4">
          <Field label="Tarayıcı Sekmesi Başlığı">
            <input value={form.siteTitle} onChange={(e) => set('siteTitle', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Üst Bar Metni">
            <input value={form.topBarText} onChange={(e) => set('topBarText', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Slogan">
            <input value={form.slogan} onChange={(e) => set('slogan', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Alt Bilgi Açıklaması">
            <textarea rows={3} value={form.footerDescription} onChange={(e) => set('footerDescription', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Ana Sayfa Kırmızı Bant Başlığı">
            <input value={form.bannerTitle} onChange={(e) => set('bannerTitle', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Ana Sayfa Kırmızı Bant Açıklaması">
            <textarea rows={3} value={form.bannerDescription} onChange={(e) => set('bannerDescription', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Hakkımızda Giriş Metni">
            <textarea rows={3} value={form.aboutLeadText} onChange={(e) => set('aboutLeadText', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Card>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className={btnPrimary}>
          <Save className="w-4 h-4" />
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Ana Sayfa Slider Yönetimi                                           */
/* ------------------------------------------------------------------ */

interface Slide {
  id: string;
  tabTitle: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  features: string[];
  featuredCard: {
    tag: string;
    name: string;
    specs: string;
    price: string;
    oldPrice?: string;
    href: string;
  };
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

function newSlide(): Slide {
  return {
    id: `slide-${Date.now()}`,
    tabTitle: 'Yeni Slayt',
    badge: 'KAMPANYA',
    titlePrefix: '',
    titleHighlight: 'Başlık Vurgusu',
    titleSuffix: '',
    description: '',
    features: ['', '', ''],
    featuredCard: { tag: '', name: '', specs: '', price: '', oldPrice: '', href: '/magaza' },
    image: '',
    primaryCta: { label: 'Mağazaya Git', href: '/magaza' },
    secondaryCta: { label: 'Detaylar', href: '/hakkimizda' },
  };
}

export function SliderPanel({ data, reload, notify }: PanelProps) {
  const [slides, setSlides] = useState<Slide[]>(
    JSON.parse(JSON.stringify(data.heroSlides))
  );
  const [open, setOpen] = useState(0);
  const [saving, setSaving] = useState(false);

  function update(idx: number, mutate: (s: Slide) => void) {
    setSlides((prev) => {
      const copy: Slide[] = JSON.parse(JSON.stringify(prev));
      mutate(copy[idx]);
      return copy;
    });
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    setSlides((prev) => {
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
    setOpen(target);
  }

  async function save() {
    setSaving(true);
    const cleaned = slides.map((s) => ({
      ...s,
      features: s.features.map((f) => f.trim()).filter(Boolean),
    }));
    const { ok, json } = await apiCall('/api/admin/site-config', 'PUT', {
      heroSlides: cleaned,
    });
    setSaving(false);
    if (!ok) notify('error', String(json.error || 'Slider kaydedilemedi.'));
    else {
      notify('success', 'Ana sayfa slider içeriği kaydedildi.');
      await reload();
    }
  }

  return (
    <div className="space-y-4">
      <Card
        title={`Ana Sayfa Slider (${slides.length} slayt)`}
        description="Slaytların sırasını, metinlerini, görsellerini ve butonlarını düzenleyin."
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className={btnGhost}
              onClick={() => {
                setSlides((p) => [...p, newSlide()]);
                setOpen(slides.length);
              }}
            >
              <Plus className="w-4 h-4" /> Slayt Ekle
            </button>
            <button type="button" className={btnPrimary} disabled={saving} onClick={save}>
              <Save className="w-4 h-4" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {slides.map((s, idx) => (
            <div key={s.id} className="rounded-xl border border-zinc-200 overflow-hidden">
              <div
                className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer ${
                  open === idx ? 'bg-red-50' : 'bg-zinc-50'
                }`}
                onClick={() => setOpen(open === idx ? -1 : idx)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {s.image && <img src={s.image} alt="" className="w-12 h-9 rounded object-cover shrink-0" />}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-zinc-900 truncate">
                      {idx + 1}. {s.tabTitle || 'Başlıksız slayt'}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">{s.badge}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="p-2 rounded-lg hover:bg-white text-zinc-500" onClick={() => move(idx, -1)} aria-label="Yukarı">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 rounded-lg hover:bg-white text-zinc-500" onClick={() => move(idx, 1)} aria-label="Aşağı">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => {
                      if (slides.length <= 1) return notify('error', 'En az bir slayt kalmalıdır.');
                      if (window.confirm('Bu slayt silinsin mi?')) {
                        setSlides((p) => p.filter((_, i) => i !== idx));
                        setOpen(0);
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Sil
                  </button>
                </div>
              </div>

              {open === idx && (
                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200">
                  <Field label="Alt Sekme Başlığı">
                    <input value={s.tabTitle} onChange={(e) => update(idx, (x) => (x.tabTitle = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Üst Etiket (kırmızı rozet)">
                    <input value={s.badge} onChange={(e) => update(idx, (x) => (x.badge = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Başlık - Başlangıç">
                    <input value={s.titlePrefix} onChange={(e) => update(idx, (x) => (x.titlePrefix = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Başlık - Kırmızı Vurgu">
                    <input value={s.titleHighlight} onChange={(e) => update(idx, (x) => (x.titleHighlight = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Başlık - Bitiş" className="sm:col-span-2">
                    <input value={s.titleSuffix} onChange={(e) => update(idx, (x) => (x.titleSuffix = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Açıklama" className="sm:col-span-2">
                    <textarea rows={3} value={s.description} onChange={(e) => update(idx, (x) => (x.description = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Madde Listesi (her satır bir madde)" className="sm:col-span-2">
                    <textarea
                      rows={3}
                      value={s.features.join('\n')}
                      onChange={(e) => update(idx, (x) => (x.features = e.target.value.split('\n')))}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Görsel Adresi" className="sm:col-span-2">
                    <input value={s.image} onChange={(e) => update(idx, (x) => (x.image = e.target.value))} className={inputCls} placeholder="https://..." />
                  </Field>

                  <div className="sm:col-span-2 text-xs font-bold text-zinc-500 uppercase tracking-wider pt-2">
                    Sağ Vitrin Kartı
                  </div>
                  <Field label="Kart Etiketi">
                    <input value={s.featuredCard.tag} onChange={(e) => update(idx, (x) => (x.featuredCard.tag = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Ürün / Hizmet Adı">
                    <input value={s.featuredCard.name} onChange={(e) => update(idx, (x) => (x.featuredCard.name = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Özellik Özeti" className="sm:col-span-2">
                    <input value={s.featuredCard.specs} onChange={(e) => update(idx, (x) => (x.featuredCard.specs = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Fiyat Yazısı">
                    <input value={s.featuredCard.price} onChange={(e) => update(idx, (x) => (x.featuredCard.price = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Eski Fiyat (isteğe bağlı)">
                    <input value={s.featuredCard.oldPrice || ''} onChange={(e) => update(idx, (x) => (x.featuredCard.oldPrice = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Kart Bağlantısı" className="sm:col-span-2">
                    <input value={s.featuredCard.href} onChange={(e) => update(idx, (x) => (x.featuredCard.href = e.target.value))} className={inputCls} />
                  </Field>

                  <div className="sm:col-span-2 text-xs font-bold text-zinc-500 uppercase tracking-wider pt-2">
                    Butonlar
                  </div>
                  <Field label="Ana Buton Yazısı">
                    <input value={s.primaryCta.label} onChange={(e) => update(idx, (x) => (x.primaryCta.label = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Ana Buton Bağlantısı">
                    <input value={s.primaryCta.href} onChange={(e) => update(idx, (x) => (x.primaryCta.href = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="İkinci Buton Yazısı">
                    <input value={s.secondaryCta.label} onChange={(e) => update(idx, (x) => (x.secondaryCta.label = e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="İkinci Buton Bağlantısı">
                    <input value={s.secondaryCta.href} onChange={(e) => update(idx, (x) => (x.secondaryCta.href = e.target.value))} className={inputCls} />
                  </Field>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
