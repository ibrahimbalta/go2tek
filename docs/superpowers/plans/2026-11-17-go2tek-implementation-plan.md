# Go2Tek Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Go2Tek ikinci el teknoloji e-ticaret mağazası ve gizli özel alıcı-satıcı talep eşleştirme, 15 aşamalı işlem takibi, 14 kriterli teknik kontrol ve finans yönetim platformunu uçtan uca geliştirmek.

**Architecture:** Next.js App Router (TypeScript + Tailwind CSS) üzerinde çalışan, Prisma + SQLite (PostgreSQL uyumlu) veritabanı kullanan, herkese açık Mağaza katmanı ile rol bazlı korunan Yönetim Paneli katmanını kesin veri sınırlarıyla ayıran modüler full-stack mimari.

**Tech Stack:** Next.js 15+, React 19, TypeScript, Tailwind CSS, Prisma ORM (SQLite), Jose (JWT HttpOnly Auth), Lucide React, Vitest (TDD & Entegrasyon Testleri).

**Spec:** `docs/superpowers/specs/2026-11-17-go2tek-platform-design.md`

## Global Constraints

- Alıcı talepleri (`BuyerRequest`) ve satıcı teklifleri (`SellerOffer`) kesinlikle herkese açık ilan olarak yayınlanmamalı ve mağaza arama sonuçlarında görünmemelidir.
- Alıcı ve satıcıların kişisel iletişim bilgileri (ad, telefon, seri no) birbirine gösterilmemelidir.
- Kapora ve ödeme kayıtları gerçek ödeme entegrasyonu veya doğrulanmış referans olmadan "başarılı" gösterilmemelidir.
- Her eşleştirme işlemi 15 zorunlu durum (`TransactionStage`) ve durum tarihçesi (`TransactionStatusHistory`) ile takip edilmelidir.
- Teknik kontrol modülü 14 zorunlu donanım/kozmetik test kalemini ve kontrol personelini kaydetmelidir.
- Tasarım dili: Beyaz/açık gri zemin, koyu lacivert (`#0F172A`) ve elektrik mavisi (`#2563EB`) vurgu, tam mobil ve masaüstü uyumluluk.

---

### Task 1: Proje Kurulumu ve Veritabanı Şeması (Aşama 1)

**Files:**
- Create: `package.json`, `tsconfig.json`, `prisma/schema.prisma`, `src/lib/prisma.ts`, `prisma/seed.ts`
- Test: `tests/schema-and-privacy.test.ts`

**Interfaces:**
- Produces: Prisma client (`prisma`), 10 core models (`User`, `Product`, `BuyerRequest`, `SellerOffer`, `MatchTransaction`, `TransactionStatusHistory`, `TechnicalInspection`, `FinancialLedger`, `StoreOrder`, `AuditLog`).

- [ ] **Step 1: Initialize Next.js + TypeScript + Prisma + Vitest project and write failing schema/isolation test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `prisma/schema.prisma`, run migration (`prisma db push`), and seed realistic initial data**
- [ ] **Step 4: Run test to verify database schema and public/private isolation queries pass**

---

### Task 2: Güvenlik, Kimlik Doğrulama, Eşleştirme Motoru ve Finans Hesaplama Kütüphaneleri (Aşama 1 & 6 & 7 & 8 Çekirdek Mantığı)

**Files:**
- Create: `src/lib/constants.ts`, `src/lib/matching-engine.ts`, `src/lib/finance-calculator.ts`, `src/lib/auth.ts`, `src/lib/rate-limit.ts`, `src/lib/payment-gateway.ts`
- Test: `tests/matching-and-finance.test.ts`, `tests/security-and-payment.test.ts`

**Interfaces:**
- Produces:
  - `calculateMatchScore(buyer: BuyerRequest, seller: SellerOffer): MatchResult`
  - `calculateFinancialSummary(input: FinancialInput): FinancialComputed`
  - `evaluateGatewayPayment(method, env): GatewayResult` (never fakes success without valid gateway configuration)
  - `validateStageTransition(fromStage, toStage)` & 15 stages metadata
  - `maskSerialNumber(serial: string, role?: string)` & `sanitizePublicRequestStatus(record)`

- [ ] **Step 1: Write failing unit tests for matching score engine, 15-stage pipeline transitions, financial gross/net profit calculations, honest payment gateway guard, and PII/serial masking**
- [ ] **Step 2: Run Vitest to confirm RED state**
- [ ] **Step 3: Implement pure business logic modules (`matching-engine.ts`, `finance-calculator.ts`, `payment-gateway.ts`, `auth.ts`, `rate-limit.ts`)**
- [ ] **Step 4: Run Vitest to confirm GREEN state**

---

### Task 3: API Uç Noktaları – Mağaza, Gizli Başvuru Formları, Güvenli Dosya Yükleme ve Yönetim API'leri (Aşama 2, 3, 4, 5, 6, 7, 8)

**Files:**
- Create:
  - `src/app/api/store/products/route.ts` (Yalnızca `isPublished: true` mağaza ürünleri)
  - `src/app/api/store/orders/route.ts` (Dürüst ödeme kuruluşu kontrolü + sipariş kaydı)
  - `src/app/api/requests/buyer/route.ts` (Alıcı talebi oluşturma - rate limit + honeypot + referans no üretimi; GET yalnızca Admin/Personel)
  - `src/app/api/requests/seller/route.ts` (Satıcı teklifi oluşturma - rate limit + güvenli fotoğraf; GET yalnızca Admin/Personel)
  - `src/app/api/requests/track/route.ts` (Başvuru no + telefon ile karşı taraf verisi içermeyen durum sorgulama)
  - `src/app/api/upload/route.ts` (MIME tip ve boyut doğrulamalı güvenli dosya yükleme)
  - `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`, `src/app/api/auth/me/route.ts`
  - `src/app/api/admin/overview/route.ts`
  - `src/app/api/admin/matching/route.ts` (Eşleştirme önerileri & yeni eşleştirme başlatma)
  - `src/app/api/admin/transactions/route.ts`, `src/app/api/admin/transactions/[id]/route.ts` (15 durum güncelleme + tarihçe + finans + teknik kontrol kaydı)
  - `src/app/api/admin/inspections/route.ts` (14 kriterli teknik kontrol oluşturma)
  - `src/app/api/admin/products/route.ts` (Mağaza ürün yönetimi)
- Test: `tests/api-isolation.test.ts`

- [ ] **Step 1: Write failing tests verifying unauthenticated users CANNOT read buyer requests or seller offers, and public store search NEVER leaks private requests/offers**
- [ ] **Step 2: Implement API route handlers with role guards, audit logging, and input validation**
- [ ] **Step 3: Run tests and verify all security and data isolation checks pass**

---

### Task 4: Kurumsal Mağaza ve Web Sitesi Sayfaları (Aşama 2, 3, 4 & Bölüm 8-9)

**Files:**
- Create:
  - `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
  - `src/app/page.tsx` (Ana Sayfa: Hero, Mağaza vitrini, Özel Alım-Satım sistemi tanıtımı, 14 Noktalı Teknik Kontrol güvencesi)
  - `src/app/magaza/page.tsx` (Mağaza + Gelişmiş kategori, fiyat, RAM, işlemci, kozmetik durum filtreleme)
  - `src/app/magaza/[kategori]/page.tsx` (`notebook`, `tablet`, `masaustu-bilgisayar`, `diger-elektronik` vb. özel kategori sayfaları)
  - `src/app/urun/[slug]/page.tsx` (Ürün Detay: Gerçek fotoğraflar, teknik özellik tablosu, 14 kriterli teknik kontrol özeti, kozmetik durum, garanti ve dürüst satın alma/sipariş modülü)
  - `src/app/butceme-gore-cihaz-bul/page.tsx` (Özel Alıcı Talep Formu + Başvuru No üretimi)
  - `src/app/cihazimi-satmak-istiyorum/page.tsx` (Özel Satıcı Teklif Formu + Fotoğraf yükleme + Gizli Seri No + Başvuru No üretimi)
  - `src/app/basvuru-sorgula/page.tsx` (Başvuru No + Telefon ile güvenli durum sorgulama)
  - `src/app/hakkimizda/page.tsx`, `src/app/iletisim/page.tsx`, `src/app/sss/page.tsx`, `src/app/gizlilik-ve-kvkk/page.tsx`, `src/app/mesafeli-satis-ve-iade-kosullari/page.tsx`

---

### Task 5: Yönetim Paneli, Eşleştirme Merkezi, 15 Aşamalı İşlem Takibi, Teknik Kontrol ve Finans Modülleri (Aşama 5, 6, 7, 8)

**Files:**
- Create:
  - `src/app/yonetim/giris/page.tsx` (Yönetici & Personel Güvenli Giriş Ekranı)
  - `src/app/yonetim/page.tsx` (Yönetim Paneli Merkezi: Genel Bakış, Alıcı Talepleri, Satıcı Teklifleri, Eşleştirme Merkezi, 15 Aşamalı İşlem Takibi & Tarihçe, 14 Kriterli Teknik Kontrol Modülü, Finans & Kâr Takibi, Mağaza Stok Yönetimi, Denetim Kayıtları / Audit Log)

---

### Task 6: Güvenlik, Mobil Uyumluluk ve Uçtan Uca Doğrulama Testleri (Aşama 9)

- [ ] Run full Vitest suite (`npm test`)
- [ ] Run production build (`npm run build`) to verify zero TypeScript or Next.js route errors
- [ ] Start server and verify all public pages, forms, and admin modules
