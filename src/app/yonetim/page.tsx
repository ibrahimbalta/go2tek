'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TRANSACTION_STAGES,
  INSPECTION_CRITERIA,
  PRODUCT_CATEGORIES,
  COSMETIC_LABELS,
} from '@/lib/constants';
import {
  LayoutDashboard,
  Users,
  Tag,
  GitCompare,
  Activity,
  ClipboardCheck,
  Wallet,
  ShoppingBag,
  ShieldAlert,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Search,
  PlusCircle,
  Clock,
  Phone,
} from 'lucide-react';

type AdminTab =
  | 'OVERVIEW'
  | 'BUYER_REQUESTS'
  | 'SELLER_OFFERS'
  | 'MATCHING_CENTER'
  | 'TRANSACTIONS'
  | 'INSPECTIONS'
  | 'FINANCE'
  | 'PRODUCTS'
  | 'ORDERS'
  | 'SITE'
  | 'SLIDER'
  | 'USERS'
  | 'AUDIT';

import {
  Package,
  Settings2,
  GalleryHorizontal,
  UserCog,
  ExternalLink,
  Menu as MenuIcon,
  X as XIcon,
} from 'lucide-react';
import { Go2TekLogo } from '@/components/layout/Go2TekLogo';
import { ProductsPanel } from '@/components/admin/ProductsPanel';
import { RequestsPanel } from '@/components/admin/RequestsPanel';
import { SitePanel, SliderPanel } from '@/components/admin/SitePanels';
import { OrdersPanel, UsersPanel } from '@/components/admin/OrdersUsersPanels';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [navOpen, setNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Dashboard state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  // Filters for Buyer Requests & Seller Offers
  const [buyerFilterCat, setBuyerFilterCat] = useState('ALL');
  const [buyerSearch, setBuyerSearch] = useState('');
  const [sellerFilterCat, setSellerFilterCat] = useState('ALL');
  const [sellerSearch, setSellerSearch] = useState('');

  // Manual Matching state
  const [selectedBuyerId, setSelectedBuyerId] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const [matchNoteInput, setMatchNoteInput] = useState('');

  // Transaction Stage Update state
  const [selectedTxId, setSelectedTxId] = useState('');
  const [targetStage, setTargetStage] = useState('');
  const [stageNote, setStageNote] = useState('');

  // Technical Inspection Form state
  const [inspTxId, setInspTxId] = useState('');
  const [inspDeviceModel, setInspDeviceModel] = useState('');
  const [inspSerial, setInspSerial] = useState('');
  const [inspInspectorName, setInspInspectorName] = useState('');
  const [inspOverallStatus, setInspOverallStatus] = useState('PASSED');
  const [inspSummaryNotes, setInspSummaryNotes] = useState('');
  const [inspTests, setInspTests] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const c of INSPECTION_CRITERIA) {
      initial[c.field] = 'PASS';
    }
    return initial;
  });

  // Financial Ledger Edit state
  const [finTxId, setFinTxId] = useState('');
  const [finForm, setFinForm] = useState({
    sellerPurchasePrice: 0,
    buyerSalePrice: 0,
    depositAmount: 0,
    depositStatus: 'NOT_PAID',
    depositVerificationRef: '',
    remainingPaymentStatus: 'NOT_PAID',
    shippingCost: 0,
    inspectionCost: 0,
    repairCost: 0,
    taxAndOtherCosts: 0,
  });

  async function loadDashboard(silent = false) {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      if (res.status === 401) {
        router.push('/');
        return;
      }
      const json = await res.json();
      setData(json);

      if (json.transactions?.length > 0 && !selectedTxId) {
        const firstTx = json.transactions[0];
        setSelectedTxId(firstTx.id);
        setTargetStage(firstTx.currentStage);
        setFinTxId(firstTx.id);
        if (firstTx.financials) {
          setFinForm({
            sellerPurchasePrice: firstTx.financials.sellerPurchasePrice,
            buyerSalePrice: firstTx.financials.buyerSalePrice,
            depositAmount: firstTx.financials.depositAmount,
            depositStatus: firstTx.financials.depositStatus,
            depositVerificationRef:
              firstTx.financials.depositVerificationRef || '',
            remainingPaymentStatus:
              firstTx.financials.remainingPaymentStatus || 'NOT_PAID',
            shippingCost: firstTx.financials.shippingCost,
            inspectionCost: firstTx.financials.inspectionCost,
            repairCost: firstTx.financials.repairCost,
            taxAndOtherCosts: firstTx.financials.taxAndOtherCosts,
          });
        }
      }
      if (json.session?.name && !inspInspectorName) {
        setInspInspectorName(json.session.name);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function notify(type: 'success' | 'error', text: string) {
    setFeedback({ type, text });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function reload() {
    await loadDashboard(true);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/g2t-portal-x94k');
  }

  async function handleCreateMatch(buyerRequestId: string, sellerOfferId: string, note?: string) {
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerRequestId,
          sellerOfferId,
          adminNotes: note || matchNoteInput,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: json.error || 'Eşleştirme yapılamadı.' });
      } else {
        setFeedback({
          type: 'success',
          text: `Eşleştirme başarıyla oluşturuldu: ${json.transaction.transactionCode}`,
        });
        await loadDashboard();
        setActiveTab('TRANSACTIONS');
      }
    } catch {
      setFeedback({ type: 'error', text: 'Sunucu hatası.' });
    }
  }

  async function handleUpdateStage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTxId || !targetStage) return;
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/transactions/${selectedTxId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStage: targetStage,
          stageNote,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: json.error || 'Durum güncellenemedi.' });
      } else {
        setFeedback({
          type: 'success',
          text: 'İşlem durumu ve tarihçesi başarıyla güncellendi.',
        });
        setStageNote('');
        await loadDashboard();
      }
    } catch {
      setFeedback({ type: 'error', text: 'Sunucu hatası.' });
    }
  }

  async function handleCreateInspection(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: inspTxId || null,
          deviceBrandModel: inspDeviceModel,
          deviceSerialNumber: inspSerial,
          inspectorName: inspInspectorName,
          overallStatus: inspOverallStatus,
          summaryNotes: inspSummaryNotes,
          ...inspTests,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: json.error || 'Kontrol kaydedilemedi.' });
      } else {
        setFeedback({
          type: 'success',
          text: `14 Kriterli Teknik Kontrol Raporu oluşturuldu: ${json.inspection.inspectionCode}`,
        });
        setInspDeviceModel('');
        setInspSerial('');
        setInspSummaryNotes('');
        await loadDashboard();
      }
    } catch {
      setFeedback({ type: 'error', text: 'Sunucu hatası.' });
    }
  }

  async function handleSaveFinance(e: React.FormEvent) {
    e.preventDefault();
    if (!finTxId) return;
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/transactions/${finTxId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financials: finForm,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: json.error || 'Finans kaydı güncellenemedi.' });
      } else {
        setFeedback({
          type: 'success',
          text: 'Finansal kayıtlar ve kârlılık hesaplamaları güncellendi.',
        });
        await loadDashboard();
      }
    } catch {
      setFeedback({ type: 'error', text: 'Sunucu hatası.' });
    }
  }

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-600">
        Go2Tek Yönetim Merkezi yükleniyor...
      </div>
    );
  }

  const {
    session,
    stats,
    buyerRequests,
    sellerOffers,
    matchSuggestions,
    transactions,
    inspections,
    products,
    storeOrders,
    auditLogs,
  } = data;

  // Filtered Buyer Requests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredBuyers = buyerRequests.filter((b: any) => {
    if (buyerFilterCat !== 'ALL' && b.category !== buyerFilterCat) return false;
    if (buyerSearch.trim()) {
      const q = buyerSearch.toLowerCase();
      return (
        b.referenceNo.toLowerCase().includes(q) ||
        b.fullName.toLowerCase().includes(q) ||
        b.brandPref.toLowerCase().includes(q) ||
        b.cpuPref.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Seller Offers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredSellers = sellerOffers.filter((s: any) => {
    if (sellerFilterCat !== 'ALL' && s.category !== sellerFilterCat) return false;
    if (sellerSearch.trim()) {
      const q = sellerSearch.toLowerCase();
      return (
        s.referenceNo.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.model.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentSelectedTx = transactions.find((t: any) => t.id === selectedTxId);

  const navGroups: Array<{
    title: string;
    items: Array<{ key: AdminTab; label: string; icon: React.ElementType; badge?: number }>;
  }> = [
    {
      title: 'Genel',
      items: [{ key: 'OVERVIEW', label: 'Genel Bakış', icon: LayoutDashboard }],
    },
    {
      title: 'Özel Talep Merkezi',
      items: [
        { key: 'BUYER_REQUESTS', label: 'Alıcı Talepleri', icon: Users, badge: stats.totalBuyerRequests },
        { key: 'SELLER_OFFERS', label: 'Satıcı Teklifleri', icon: Tag, badge: stats.totalSellerOffers },
        { key: 'MATCHING_CENTER', label: 'Eşleştirme Merkezi', icon: GitCompare, badge: matchSuggestions.length },
        { key: 'TRANSACTIONS', label: 'İşlem Takibi', icon: Activity },
      ],
    },
    {
      title: 'Operasyon',
      items: [
        { key: 'INSPECTIONS', label: 'Teknik Kontrol', icon: ClipboardCheck },
        { key: 'FINANCE', label: 'Finans ve Kâr', icon: Wallet },
      ],
    },
    {
      title: 'Mağaza',
      items: [
        { key: 'PRODUCTS', label: 'Ürünler', icon: Package, badge: products.length },
        { key: 'ORDERS', label: 'Siparişler', icon: ShoppingBag, badge: storeOrders.length },
      ],
    },
    {
      title: 'Site İçeriği',
      items: [
        { key: 'SITE', label: 'Site Ayarları', icon: Settings2 },
        { key: 'SLIDER', label: 'Ana Sayfa Slider', icon: GalleryHorizontal },
      ],
    },
    {
      title: 'Sistem',
      items: [
        { key: 'USERS', label: 'Personel', icon: UserCog },
        { key: 'AUDIT', label: 'İşlem Kayıtları', icon: ShieldAlert },
      ],
    },
  ];

  const currentTitle =
    navGroups.flatMap((g) => g.items).find((i) => i.key === activeTab)?.label || 'Yönetim';

  const ROLE_NAMES: Record<string, string> = {
    ADMIN: 'Genel Yönetici',
    SALES_STAFF: 'Satış & Eşleştirme',
    TECHNICAL_STAFF: 'Teknik Kontrol',
    FINANCE_STAFF: 'Finans',
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      {/* Mobil menü arka planı */}
      {navOpen && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/50 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Sol menü */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 text-zinc-300 flex flex-col transition-transform duration-200 ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="px-5 py-5 border-b border-zinc-800 flex items-center justify-between">
          <Go2TekLogo variant="dark" size="sm" />
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800"
            onClick={() => setNavOpen(false)}
            aria-label="Menüyü kapat"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.key);
                        setFeedback(null);
                        setNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        active
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            active ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-3">
          <div className="px-1">
            <div className="text-sm font-semibold text-white truncate">{session.name}</div>
            <div className="text-xs text-zinc-500">{ROLE_NAMES[session.role] || session.role}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-red-600 text-white text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* İçerik alanı */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50"
              onClick={() => setNavOpen(true)}
              aria-label="Menüyü aç"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-zinc-900 truncate">{currentTitle}</h1>
              <p className="text-xs text-zinc-500 hidden sm:block">
                Go2Tek Yönetim Paneli • Başvurular yalnızca bu panelde görünür
              </p>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Siteyi Görüntüle</span>
          </a>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* TAB 1: GENEL BAKIŞ */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">
                Toplam Alıcı Talebi
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {stats.totalBuyerRequests}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">
                Toplam Satıcı Teklifi
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {stats.totalSellerOffers}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/30">
              <span className="text-xs font-semibold text-blue-700">
                Bekleyen Eşleştirmeler
              </span>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {stats.pendingMatches}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30">
              <span className="text-xs font-semibold text-amber-800">
                Aktif Alım-Satım İşlemi
              </span>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {stats.activeTransactions}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30">
              <span className="text-xs font-semibold text-emerald-800">
                Tamamlanan İşlemler
              </span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {stats.completedTransactions}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">
                Mağaza Satış / Stok
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {stats.storeSalesCount} / {stats.storeProductsCount}
              </div>
            </div>
          </div>

          {/* Active Transactions Quick Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">
                Güncel Eşleştirme ve Alım-Satım İşlemleri
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('TRANSACTIONS')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Tüm İşlem Takibine Git →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 pr-4">İşlem Kodu</th>
                    <th className="py-2.5 pr-4">Alıcı Talebi</th>
                    <th className="py-2.5 pr-4">Satıcı Teklifi (Cihaz)</th>
                    <th className="py-2.5 pr-4">Uyum Skoru</th>
                    <th className="py-2.5 pr-4">Güncel Durum (15 Aşama)</th>
                    <th className="py-2.5 pr-4">Tahmini Net Kâr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {transactions.map((tx: any) => {
                    const stageMeta =
                      TRANSACTION_STAGES.find((s) => s.key === tx.currentStage) ||
                      TRANSACTION_STAGES[0];
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-3 pr-4 font-bold text-slate-900">
                          {tx.transactionCode}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-bold text-slate-800">
                            {tx.buyerRequest?.referenceNo} - {tx.buyerRequest?.fullName}
                          </div>
                          <div className="text-slate-500">
                            Bütçe: {tx.buyerRequest?.minBudget?.toLocaleString('tr-TR')} -{' '}
                            {tx.buyerRequest?.maxBudget?.toLocaleString('tr-TR')} TL
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-bold text-slate-800">
                            {tx.sellerOffer?.brand} {tx.sellerOffer?.model}
                          </div>
                          <div className="text-slate-500">
                            Satıcı Fiyatı:{' '}
                            {tx.sellerOffer?.requestedPrice?.toLocaleString('tr-TR')} TL
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">
                            %{tx.matchScore}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold ${stageMeta.badgeColor}`}
                          >
                            {stageMeta.step}. {stageMeta.label}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-bold text-emerald-700">
                          {tx.financials?.estimatedNetProfit?.toLocaleString('tr-TR')} TL
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ALICI TALEPLERİ */}
      {activeTab === 'BUYER_REQUESTS' && (
        <RequestsPanel type="BUYER" data={data} reload={reload} notify={notify} />
      )}

      {/* SATICI TEKLİFLERİ */}
      {activeTab === 'SELLER_OFFERS' && (
        <RequestsPanel type="SELLER" data={data} reload={reload} notify={notify} />
      )}

      {/* TAB 4: EŞLEŞTİRME MERKEZİ */}
      {activeTab === 'MATCHING_CENTER' && (
        <div className="space-y-6">
          {/* Smart Matching Recommendations */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase">
                Akıllı Karar Destek Sistemi
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Otomatik Kriter Analizi ve Eşleşme Önerileri
              </h2>
              <p className="text-xs text-slate-500">
                Sistem; bütçe uyumu (30p), marka/model (15p), işlemci (15p), RAM (15p), depolama (10p), ekran kartı (8p) ve kozmetik durum (7p) kriterlerine göre öneri sunar. Otomatik satış yapılmaz; son karar yöneticiye aittir.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {matchSuggestions.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black">
                        Toplam Uyum: %{item.evaluation.totalScore}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Önerilen Alıcı Satış Fiyatı:{' '}
                        {item.evaluation.suggestedBuyerSalePrice.toLocaleString('tr-TR')} TL
                        (Tahmini Brüt Marj:{' '}
                        {item.evaluation.estimatedMarginAmount.toLocaleString('tr-TR')} TL)
                      </span>
                    </div>
                    {item.alreadyMatched ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                        Eşleştirme Kaydı Mevcut
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleCreateMatch(
                            item.buyerRequest.id,
                            item.sellerOffer.id,
                            `Eşleştirme merkezinden %${item.evaluation.totalScore} uyum skoru ile başlatıldı.`
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition"
                      >
                        Bu Eşleştirmeyi Başlat (Yönetici Onayı)
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold text-blue-600 uppercase">
                        Alıcı Talebi ({item.buyerRequest.referenceNo})
                      </span>
                      <div className="font-bold text-slate-900">
                        {item.buyerRequest.fullName} ({item.buyerRequest.phone})
                      </div>
                      <div className="text-slate-600">
                        Aranan: {item.buyerRequest.brandPref} • {item.buyerRequest.cpuPref} •{' '}
                        {item.buyerRequest.ramPref} • {item.buyerRequest.storagePref}
                      </div>
                      <div className="font-bold text-emerald-700">
                        Bütçe: {item.buyerRequest.minBudget.toLocaleString('tr-TR')} -{' '}
                        {item.buyerRequest.maxBudget.toLocaleString('tr-TR')} TL
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase">
                        Satıcı Teklifi ({item.sellerOffer.referenceNo})
                      </span>
                      <div className="font-bold text-slate-900">
                        {item.sellerOffer.brand} {item.sellerOffer.model} —{' '}
                        {item.sellerOffer.fullName} ({item.sellerOffer.phone})
                      </div>
                      <div className="text-slate-600">
                        Donanım: {item.sellerOffer.cpu} • {item.sellerOffer.ram} •{' '}
                        {item.sellerOffer.storage} • Kozmetik: {item.sellerOffer.cosmeticCondition}
                      </div>
                      <div className="font-bold text-blue-700">
                        Satıcının İstediği Fiyat:{' '}
                        {item.sellerOffer.requestedPrice.toLocaleString('tr-TR')} TL
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200">
                      Bütçe: {item.evaluation.criteriaBreakdown.budgetMatch}/30
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200">
                      Marka/Model: {item.evaluation.criteriaBreakdown.brandModelMatch}/15
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200">
                      CPU: {item.evaluation.criteriaBreakdown.cpuMatch}/15
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200">
                      RAM: {item.evaluation.criteriaBreakdown.ramMatch}/15
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200">
                      Depolama: {item.evaluation.criteriaBreakdown.storageMatch}/10
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200">
                      GPU: {item.evaluation.criteriaBreakdown.gpuMatch}/8
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200">
                      Kozmetik: {item.evaluation.criteriaBreakdown.cosmeticMatch}/7
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Match Creator */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Manuel Alıcı & Satıcı Eşleştirmesi Oluştur
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedBuyerId}
                onChange={(e) => setSelectedBuyerId(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="">Alıcı Talebi Seçin...</option>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {buyerRequests.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.referenceNo} - {b.fullName} ({b.category} / Maks{' '}
                    {b.maxBudget.toLocaleString('tr-TR')} TL)
                  </option>
                ))}
              </select>

              <select
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="">Satıcı Teklifi Seçin...</option>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {sellerOffers.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.referenceNo} - {s.brand} {s.model} (
                    {s.requestedPrice.toLocaleString('tr-TR')} TL)
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={matchNoteInput}
                onChange={(e) => setMatchNoteInput(e.target.value)}
                placeholder="Yönetici eşleştirme notu..."
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <button
              type="button"
              disabled={!selectedBuyerId || !selectedSellerId}
              onClick={() => handleCreateMatch(selectedBuyerId, selectedSellerId)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50"
            >
              Seçili Kayıtları Eşleştir
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: İŞLEM TAKİBİ (15 DURUM & TARİHÇE) */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-black text-slate-900">
              İşlem Seçimi ve 15 Aşamalı Durum Yönetimi
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Takip Edilen Eşleştirme İşlemi
              </label>
              <select
                value={selectedTxId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedTxId(id);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const found = transactions.find((t: any) => t.id === id);
                  if (found) setTargetStage(found.currentStage);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-bold"
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {transactions.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.transactionCode} — {t.buyerRequest?.fullName} ↔{' '}
                    {t.sellerOffer?.brand} {t.sellerOffer?.model}
                  </option>
                ))}
              </select>
            </div>

            {currentSelectedTx && (
              <form onSubmit={handleUpdateStage} className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div>
                    <strong>Alıcı:</strong> {currentSelectedTx.buyerRequest?.fullName} (
                    {currentSelectedTx.buyerRequest?.phone})
                  </div>
                  <div>
                    <strong>Satıcı:</strong> {currentSelectedTx.sellerOffer?.fullName} (
                    {currentSelectedTx.sellerOffer?.phone})
                  </div>
                  <div>
                    <strong>Cihaz:</strong> {currentSelectedTx.sellerOffer?.brand}{' '}
                    {currentSelectedTx.sellerOffer?.model}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Yeni İşlem Durumu Seçin (1 - 15)
                  </label>
                  <select
                    value={targetStage}
                    onChange={(e) => setTargetStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                  >
                    {TRANSACTION_STAGES.map((st) => (
                      <option key={st.key} value={st.key}>
                        {st.step}. {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Durum Değişiklik Açıklaması (Tarihçeye Kaydedilir)
                  </label>
                  <textarea
                    rows={2}
                    value={stageNote}
                    onChange={(e) => setStageNote(e.target.value)}
                    placeholder="Örn: Alıcı ile görüşüldü, kapora dekontu kontrol edildi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                >
                  Durumu Güncelle ve Tarihçeye Kaydet
                </button>
              </form>
            )}
          </div>

          {/* Right: 15-Stage Pipeline & Status History */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <h3 className="text-base font-black text-slate-900">
              15 Aşamalı Süreç Haritası ve Durum Tarihçesi
            </h3>

            {currentSelectedTx && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {TRANSACTION_STAGES.map((st) => {
                    const isCurrent = currentSelectedTx.currentStage === st.key;
                    return (
                      <div
                        key={st.key}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isCurrent
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-black'
                            : 'border-slate-200/70 bg-slate-50/50 text-slate-600'
                        }`}
                      >
                        <span className="truncate">
                          {st.step}. {st.label}
                        </span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Durum Değişiklik Tarihçesi ({currentSelectedTx.statusHistory?.length || 0} Kayıt)
                  </h4>
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {currentSelectedTx.statusHistory?.map((h: any) => {
                      const toMeta = TRANSACTION_STAGES.find(
                        (s) => s.key === h.toStage
                      );
                      return (
                        <div
                          key={h.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900">
                              {toMeta
                                ? `${toMeta.step}. ${toMeta.label}`
                                : h.toStage}
                            </div>
                            <p className="text-slate-600">{h.note}</p>
                            <div className="text-[11px] text-slate-400">
                              İşlemi Yapan: {h.changedByName}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            {new Date(h.createdAt).toLocaleString('tr-TR')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: TEKNİK KONTROL MODÜLÜ (14 TEST) */}
      {activeTab === 'INSPECTIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateInspection}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-5"
          >
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase">
                Go2Tek Laboratuvar Ekspertiz Formu
              </span>
              <h2 className="text-lg font-black text-slate-900">
                14 Noktalı Yeni Teknik Kontrol Kaydı Oluştur
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  İlgili Eşleştirme İşlemi (Opsiyonel)
                </label>
                <select
                  value={inspTxId}
                  onChange={(e) => setInspTxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">Mağaza Stoku / Bağımsız Cihaz</option>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {transactions.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.transactionCode} ({t.sellerOffer?.brand} {t.sellerOffer?.model})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kontrolü Yapan Personel *
                </label>
                <input
                  type="text"
                  required
                  value={inspInspectorName}
                  onChange={(e) => setInspInspectorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cihaz Marka ve Model *
                </label>
                <input
                  type="text"
                  required
                  value={inspDeviceModel}
                  onChange={(e) => setInspDeviceModel(e.target.value)}
                  placeholder="Örn: Monster Tulpar T7 V20.6"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cihaz Seri Numarası
                </label>
                <input
                  type="text"
                  value={inspSerial}
                  onChange={(e) => setInspSerial(e.target.value)}
                  placeholder="Seri No"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* 14 Criteria Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                14 Zorunlu Donanım ve Kozmetik Test Sonuçları
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INSPECTION_CRITERIA.map((crit) => (
                  <div
                    key={crit.field}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-semibold text-slate-800">
                      {crit.index}. {crit.label}
                    </span>
                    <select
                      value={inspTests[crit.field] || 'PASS'}
                      onChange={(e) =>
                        setInspTests((prev) => ({
                          ...prev,
                          [crit.field]: e.target.value,
                        }))
                      }
                      className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-[11px]"
                    >
                      <option value="PASS">GEÇTİ (PASS)</option>
                      <option value="WARNING">UYARI (WARNING)</option>
                      <option value="FAIL">KALDI (FAIL)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Genel Teknik Kontrol Sonucu
                </label>
                <select
                  value={inspOverallStatus}
                  onChange={(e) => setInspOverallStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="PASSED">ONAYLANDI (Teknik Kontrolden Geçti)</option>
                  <option value="CONDITIONAL_PASS">ŞARTLI ONAY (Kozmetik/Bakım Notlu)</option>
                  <option value="FAILED">REDDEDİLDİ (Kontrolden Geçemedi)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teknik Uzman Raporu ve Açıklamalar *
              </label>
              <textarea
                rows={3}
                required
                value={inspSummaryNotes}
                onChange={(e) => setInspSummaryNotes(e.target.value)}
                placeholder="Sıcaklık değerleri, SSD sağlık yüzdesi, pil döngüsü ve kozmetik detayları yazın..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              14 Noktalı Teknik Kontrol Raporunu Kaydet
            </button>
          </form>

          {/* Existing Inspections List */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Kayıtlı Teknik Kontrol Raporları ({inspections.length})
            </h3>
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {inspections.map((ins: any) => (
                <div
                  key={ins.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">
                      {ins.inspectionCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        ins.overallStatus === 'PASSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ins.overallStatus}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800">
                    {ins.deviceBrandModel} (SN: {ins.deviceSerialNumber})
                  </div>
                  <p className="text-slate-600 leading-relaxed">{ins.summaryNotes}</p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/70">
                    Kontrol Uzmanı: <strong>{ins.inspectorName}</strong> •{' '}
                    {new Date(ins.inspectedAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: FİNANS VE İŞLEM TAKİBİ */}
      {activeTab === 'FINANCE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSaveFinance}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-5"
          >
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase">
                Go2Tek Finans & Kârlılık Modülü
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Alım-Satım Maliyet, Kapora ve Net Kâr Hesaplama
              </h2>
              <p className="text-xs text-slate-500">
                Gerçek ödeme kuruluşu veya banka dekont referansı olmadan kapora &quot;Ödendi (VERIFIED_PAID)&quot; olarak işaretlenemez.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                İşlem Seçin
              </label>
              <select
                value={finTxId}
                onChange={(e) => {
                  const id = e.target.value;
                  setFinTxId(id);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const tx = transactions.find((t: any) => t.id === id);
                  if (tx?.financials) {
                    setFinForm({
                      sellerPurchasePrice: tx.financials.sellerPurchasePrice,
                      buyerSalePrice: tx.financials.buyerSalePrice,
                      depositAmount: tx.financials.depositAmount,
                      depositStatus: tx.financials.depositStatus,
                      depositVerificationRef:
                        tx.financials.depositVerificationRef || '',
                      remainingPaymentStatus:
                        tx.financials.remainingPaymentStatus || 'NOT_PAID',
                      shippingCost: tx.financials.shippingCost,
                      inspectionCost: tx.financials.inspectionCost,
                      repairCost: tx.financials.repairCost,
                      taxAndOtherCosts: tx.financials.taxAndOtherCosts,
                    });
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-bold"
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {transactions.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.transactionCode} — {t.sellerOffer?.brand}{' '}
                    {t.sellerOffer?.model} ({t.currentStage})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Satıcıdan Alış Fiyatı (TL)
                </label>
                <input
                  type="number"
                  value={finForm.sellerPurchasePrice}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      sellerPurchasePrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alıcıya Satış Fiyatı (TL)
                </label>
                <input
                  type="number"
                  value={finForm.buyerSalePrice}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      buyerSalePrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alınan Kapora Tutarı (TL)
                </label>
                <input
                  type="number"
                  value={finForm.depositAmount}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      depositAmount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kapora Doğrulama Durumu
                </label>
                <select
                  value={finForm.depositStatus}
                  onChange={(e) =>
                    setFinForm({ ...finForm, depositStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="NOT_PAID">Ödenmedi (NOT_PAID)</option>
                  <option value="AWAITING_VERIFICATION">
                    Doğrulama Bekliyor (AWAITING_VERIFICATION)
                  </option>
                  <option value="VERIFIED_PAID">
                    Ödeme/Dekont Doğrulandı (VERIFIED_PAID)
                  </option>
                  <option value="REFUNDED">İade Edildi (REFUNDED)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-blue-700 mb-1">
                  Ödeme Kuruluşu / Banka Dekont Referans No (VERIFIED_PAID İçin Zorunlu)
                </label>
                <input
                  type="text"
                  value={finForm.depositVerificationRef}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      depositVerificationRef: e.target.value,
                    })
                  }
                  placeholder="Örn: TR-DEKONT-2026-4410 veya IYZ-REF-99182"
                  className="w-full px-3 py-2 rounded-xl border border-blue-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kargo ve Teslimat Giderleri (TL)
                </label>
                <input
                  type="number"
                  value={finForm.shippingCost}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      shippingCost: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teknik Kontrol Giderleri (TL)
                </label>
                <input
                  type="number"
                  value={finForm.inspectionCost}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      inspectionCost: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Onarım / Bakım Giderleri (TL)
                </label>
                <input
                  type="number"
                  value={finForm.repairCost}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      repairCost: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Vergi ve Diğer Masraflar (TL)
                </label>
                <input
                  type="number"
                  value={finForm.taxAndOtherCosts}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      taxAndOtherCosts: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Kalan Ödeme Tahsilat Durumu
                </label>
                <select
                  value={finForm.remainingPaymentStatus}
                  onChange={(e) =>
                    setFinForm({
                      ...finForm,
                      remainingPaymentStatus: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="NOT_PAID">Bekleniyor (NOT_PAID)</option>
                  <option value="VERIFIED_PAID">
                    Tamamı Tahsil Edildi (VERIFIED_PAID)
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              Finans ve Kârlılık Kaydını Güncelle
            </button>
          </form>

          {/* Right Financial Summary Cards */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              İşlem Bazlı Finans Özeti
            </h3>
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {transactions.map((t: any) => {
                const f = t.financials;
                if (!f) return null;
                return (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{t.transactionCode}</span>
                      <span className="text-blue-600">{t.currentStage}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        Alış: <strong>{f.sellerPurchasePrice.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <div>
                        Satış: <strong>{f.buyerSalePrice.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <div>
                        Kapora: <strong>{f.depositAmount.toLocaleString('tr-TR')} TL</strong> (
                        {f.depositStatus})
                      </div>
                      <div>
                        Kalan Ödeme:{' '}
                        <strong>{f.remainingAmount.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <div>
                        Tahmini Brüt Kâr:{' '}
                        <strong className="text-slate-900">
                          {f.estimatedGrossProfit.toLocaleString('tr-TR')} TL
                        </strong>
                      </div>
                      <div>
                        Tahmini Net Kâr:{' '}
                        <strong className="text-emerald-700">
                          {f.estimatedNetProfit.toLocaleString('tr-TR')} TL
                        </strong>
                      </div>
                      <div>
                        Gerçekleşen Brüt:{' '}
                        <strong>{f.actualGrossProfit.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <div>
                        Gerçekleşen Net:{' '}
                        <strong className="text-emerald-800">
                          {f.actualNetProfit.toLocaleString('tr-TR')} TL
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ÜRÜNLER */}
      {activeTab === 'PRODUCTS' && (
        <ProductsPanel data={data} reload={reload} notify={notify} />
      )}

      {/* SİPARİŞLER */}
      {activeTab === 'ORDERS' && (
        <OrdersPanel data={data} reload={reload} notify={notify} />
      )}

      {/* SİTE AYARLARI */}
      {activeTab === 'SITE' && (
        <SitePanel data={data} reload={reload} notify={notify} />
      )}

      {/* SLIDER */}
      {activeTab === 'SLIDER' && (
        <SliderPanel data={data} reload={reload} notify={notify} />
      )}

      {/* PERSONEL */}
      {activeTab === 'USERS' && (
        <UsersPanel data={data} reload={reload} notify={notify} />
      )}

      {/* TAB 9: DENETİM KAYITLARI (AUDIT LOG) */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900">
            Yönetici ve Personel İşlem Kayıtları (Audit Logs)
          </h2>
          <div className="space-y-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {auditLogs.map((log: any) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold mr-2">
                    {log.action}
                  </span>
                  <strong className="text-slate-900">{log.userEmail}</strong> ({log.userRole}):{' '}
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(log.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
        </main>
      </div>
    </div>
  );
}
