# Go2Tek – İkinci El Teknoloji E-Ticaret ve Özel Talep Eşleştirme Platformu Sistem Tasarımı

**Tarih:** 2026-11-17  
**Teknoloji Yığını:** Next.js (App Router, TypeScript), Tailwind CSS, Prisma ORM (SQLite/PostgreSQL uyumlu), Vitest, Jose (HttpOnly JWT Kimlik Doğrulama)

---

## 1. Vizyon ve Mimari Sınırlar

Go2Tek iki çekirdek iş modelini tek bir kurumsal çatı altında birleştirir:
1. **Go2Tek Mağaza (`Product`):** Go2Tek'in kendi stokunda bulunan, 14 kriterli teknik kontrolden geçmiş ürünlerin doğrudan satışı.
2. **Go2Tek Özel Alım-Satım Talep Sistemi (`BuyerRequest` & `SellerOffer`):** Alıcıların bütçe ve donanım beklentilerine göre oluşturduğu özel alım talepleri ile satıcıların cihazlarını satmak için oluşturduğu özel tekliflerin, **kesinlikle herkese açık ilan olarak yayınlanmadan**, yalnızca Go2Tek Yönetim Paneli'nde eşleştirilip aracılık edilmesi.

### Gizlilik ve İzolasyon Garantisi
- Herkese açık sayfalar, arama uç noktaları ve SEO site haritaları **yalnızca** `Product` (`isPublished = true`) tablosuna erişir.
- `BuyerRequest` ve `SellerOffer` tablolarının listeleme ve detay okuma servisleri sunucu tarafında `requireRole(['ADMIN', 'SALES_STAFF', 'TECHNICAL_STAFF', 'FINANCE_STAFF'])` koruması altındadır.
- Alıcı ve satıcıların kişisel iletişim bilgileri (ad soyad, telefon, seri numarası) hiçbir zaman karşı tarafa gösterilmez; tüm iletişim Go2Tek yöneticileri tarafından yürütülür.
- Müşteriler `/basvuru-sorgula` ekranında yalnızca kendi **Başvuru Numarası (`referenceNo`)** ve **Telefon Numarası** doğrulaması ile başvurularının genel aşamasını görebilir; eşleşen karşı tarafın bilgisi kesinlikle paylaşılmaz.

---

## 2. Veritabanı Şeması

### 2.1. `User` (Yönetici ve Personel)
- `id`, `name`, `email` (unique), `passwordHash`, `role` (`ADMIN`, `SALES_STAFF`, `TECHNICAL_STAFF`, `FINANCE_STAFF`), `isActive`, `createdAt`, `updatedAt`

### 2.2. `Product` (Mağaza Ürünleri)
- `id`, `slug` (unique), `sku` (unique), `title`, `description`, `category` (`NOTEBOOK`, `TABLET`, `DESKTOP`, `MONITOR`, `PHONE`, `PARTS`, `PERIPHERALS`, `OTHER`)
- Teknik özellikler: `brand`, `model`, `cpu`, `ram`, `ramGb` (int), `storage`, `storageGb` (int), `gpu`, `screenSize`, `cosmeticCondition` (`A_PLUS`, `A`, `B`, `C`), `batteryHealth` (int/string)
- Görsel ve ticari: `images` (JSON string array), `price` (Float), `stockStatus` (`IN_STOCK`, `RESERVED`, `SOLD`, `OUT_OF_STOCK`), `warrantyInfo`, `technicalCheckSummary`
- İlişki: `inspectionId` (opsiyonel `TechnicalInspection` referansı), `isPublished` (Boolean)

### 2.3. `BuyerRequest` (Özel Alıcı Talebi – Gizli)
- `id`, `referenceNo` (unique, örn. `G2T-AL-2026-XXXX`)
- `category`, `brandPref`, `cpuPref`, `ramPref`, `minRamGb` (int), `storagePref`, `minStorageGb` (int), `gpuPref`, `screenSizePref`, `minBudget` (Float), `maxBudget` (Float), `cosmeticPref`, `usagePurpose`, `additionalNotes`
- Kişisel veriler: `fullName`, `phone`, `contactConsent` (Boolean), `kvkkConsent` (Boolean)
- Durum: `status` (`NEW`, `REVIEWING`, `MATCHED`, `COMPLETED`, `CANCELLED`), `createdAt`, `updatedAt`

### 2.4. `SellerOffer` (Özel Satıcı Teklifi – Gizli)
- `id`, `referenceNo` (unique, örn. `G2T-SAT-2026-XXXX`)
- `category`, `brand`, `model`, `serialNumber` (gizli, yalnız yetkili erişim), `cpu`, `ram`, `ramGb` (int), `storage`, `storageGb` (int), `gpu`, `screenSize`, `cosmeticCondition`, `batteryHealth`, `knownDefects`, `photos` (JSON string array), `requestedPrice` (Float)
- Kişisel veriler: `fullName`, `phone`, `description`, `contactConsent` (Boolean), `kvkkConsent` (Boolean)
- Durum: `status` (`NEW`, `REVIEWING`, `MATCHED`, `PURCHASED`, `REJECTED`, `CANCELLED`), `createdAt`, `updatedAt`

### 2.5. `MatchTransaction` (Eşleştirme ve 15 Aşamalı İşlem Takibi)
- `id`, `transactionCode` (unique, örn. `G2T-ISL-2026-XXXX`)
- `buyerRequestId`, `sellerOfferId`, `matchScore` (int, 0-100), `matchAnalysisJson` (JSON)
- `currentStage`:
  1. `NEW_REQUEST` – Yeni talep
  2. `MATCH_PROPOSED` – Eşleşme önerildi
  3. `BUYER_CONTACTED` – Alıcıyla iletişim kuruldu
  4. `BUYER_ACCEPTED` – Alıcı kabul etti
  5. `DEPOSIT_PENDING` – Kapora bekleniyor
  6. `DEPOSIT_RECEIVED` – Kapora alındı
  7. `SELLER_AGREED` – Satıcıyla anlaşma sağlandı
  8. `DEVICE_RECEIVED` – Cihaz teslim alındı
  9. `INSPECTION_IN_PROGRESS` – Teknik kontrol yapılıyor
  10. `INSPECTION_PASSED` – Teknik kontrolden geçti
  11. `READY_FOR_SALE` – Satışa hazır
  12. `DELIVERED_TO_BUYER` – Alıcıya teslim edildi
  13. `COMPLETED` – İşlem tamamlandı
  14. `CANCELLED` – İptal edildi
  15. `RETURN_DISPUTE` – İade/uyuşmazlık sürecinde
- `assignedUserId`, `adminNotes`, `createdAt`, `updatedAt`

### 2.6. `TransactionStatusHistory` (Durum Değişiklik Tarihçesi)
- `id`, `transactionId`, `fromStage`, `toStage`, `changedByUserId`, `changedByName`, `note`, `createdAt`

### 2.7. `TechnicalInspection` (14 Kriterli Teknik Kontrol Modülü)
- `id`, `inspectionCode` (unique), `transactionId` (opsiyonel), `sellerOfferId` (opsiyonel), `productId` (opsiyonel)
- `inspectorUserId`, `inspectorName`, `deviceBrandModel`, `deviceSerialNumber`
- 14 Test Kalemi (`PASS` | `WARNING` | `FAIL` ve açıklama):
  1. `screenTest` (Ekran testi)
  2. `keyboardTest` (Klavye testi)
  3. `touchpadTest` (Touchpad testi)
  4. `usbPortsTest` (USB ve bağlantı noktaları)
  5. `wifiTest` (Wi-Fi)
  6. `cameraTest` (Kamera)
  7. `speakerTest` (Hoparlör)
  8. `microphoneTest` (Mikrofon)
  9. `storageHealthTest` (SSD/HDD sağlık durumu)
  10. `ramTest` (RAM testi)
  11. `cpuThermalTest` (İşlemci ve sıcaklık kontrolü)
  12. `batteryHealthTest` (Pil sağlığı)
  13. `chargerAdapterTest` (Şarj adaptörü)
  14. `cosmeticCheck` (Kozmetik kontrol)
- `overallStatus` (`PASSED`, `CONDITIONAL_PASS`, `FAILED`), `summaryNotes`, `photos` (JSON), `inspectedAt`

### 2.8. `FinancialLedger` (Finans ve İşlem Takibi)
- `id`, `transactionId` (unique)
- `sellerPurchasePrice` (Satıcıdan alış fiyatı)
- `buyerSalePrice` (Alıcıya satış fiyatı)
- `depositAmount` (Alınan kapora)
- `depositStatus` (`NOT_PAID`, `AWAITING_GATEWAY_OR_RECEIPT`, `VERIFIED_PAID`, `REFUNDED`)
- `depositVerificationRef` (Ödeme kuruluşu işlem no veya banka dekont referansı)
- `remainingAmount` (Kalan ödeme)
- `remainingPaymentStatus` (`NOT_PAID`, `VERIFIED_PAID`)
- Gider kalemleri: `shippingCost`, `inspectionCost`, `repairCost`, `taxAndOtherCosts`
- Kârlılık: `estimatedGrossProfit`, `estimatedNetProfit`, `actualGrossProfit`, `actualNetProfit`

### 2.9. `StoreOrder` (Mağaza Sipariş & Ödeme Kaydı)
- `id`, `orderNo` (unique), `productId`, `customerName`, `customerPhone`, `customerEmail`, `shippingAddress`, `amount`, `paymentMethod` (`PAYMENT_GATEWAY`, `BANK_TRANSFER`), `paymentStatus` (`GATEWAY_NOT_CONFIGURED`, `PENDING_VERIFICATION`, `PAID_VERIFIED`, `CANCELLED`), `gatewayReference`, `createdAt`

### 2.10. `AuditLog` (Yönetici İşlem Kayıtları)
- `id`, `userId`, `userEmail`, `userRole`, `action`, `entityType`, `entityId`, `details`, `ipAddress`, `createdAt`

---

## 3. Eşleştirme Motoru Algoritması (`src/lib/matching-engine.ts`)

Yöneticiye karar desteği sunan deterministik, açıklanabilir puanlama motoru:
- **Zorunlu Kriter:** `buyerRequest.category === sellerOffer.category`
- **Puanlama (0–100):**
  1. **Bütçe ve Satıcı Fiyatı Uyumu (35 Puan):** Satıcının `requestedPrice` değeri alıcının `maxBudget` değerinin altındaysa ve Go2Tek hedef hizmet marjına (%8-%15) alan bırakıyorsa 35 tam puan; bütçe sınırındaysa 20-28 puan; maksimum bütçeyi %15'e kadar aşıyorsa pazarlık payı uyarısıyla 10 puan.
  2. **Marka & Model Uyumu (15 Puan):** Alıcı spesifik marka belirttiyse ve eşleşiyorsa 15 puan; "Farketmez" ise 15 puan; farklıysa 5 puan.
  3. **İşlemci (CPU) Uyumu (15 Puan):** CPU ailesi/nesil eşleşmesi (i5/i7/i9, Ryzen 5/7, M1/M2/M3).
  4. **RAM Kapasitesi Uyumu (15 Puan):** `sellerOffer.ramGb >= buyerRequest.minRamGb` ise 15 puan.
  5. **Depolama (SSD/HDD) Uyumu (10 Puan):** `sellerOffer.storageGb >= buyerRequest.minStorageGb` ise 10 puan.
  6. **Ekran Kartı & Kozmetik Durum Uyumu (10 Puan):** GPU ve kozmetik beklenti karşılaştırması.

---

## 4. Ödeme ve Güvenlik İlkeleri

1. **Dürüst Ödeme Kuralı:** Yetkili ödeme kuruluşu (iyzico/PayTR) API anahtarları tanımlı değilken hiçbir kapora veya mağaza satışı "Kartla Ödeme Başarılı" olarak sahte şekilde işaretlenmez. Sistem ödeme kuruluşu durumunu şeffafça denetler; kapora/tahsilat kaydının `VERIFIED_PAID` olabilmesi için gerçek ödeme kuruluşu referansı veya yöneticinin doğruladığı banka/dekont referansı zorunludur.
2. **Dosya Yükleme Güvenliği:** Yalnızca izin verilen görsel MIME tipleri (`image/jpeg`, `image/png`, `image/webp`), maksimum dosya boyutu (5 MB) ve rastgele UUID dosya adlandırması uygulanır.
3. **Rate Limiting & Spam Koruması:** Alıcı talep ve satıcı teklif uç noktalarında IP bazlı hız sınırlandırma ve honeypot koruması bulunur.
4. **Rol Tabanlı Yetkilendirme & Audit Log:** Her durum değişikliği, finans güncellemesi ve teknik kontrol raporu `AuditLog` ve `TransactionStatusHistory` tablolarına kaydedilir.
