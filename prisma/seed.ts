import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto
    .createHmac('sha256', 'go2tek-salt-2026')
    .update(password)
    .digest('hex');
}

async function main() {
  console.log('Go2Tek veritabanı başlangıç verileri hazırlanıyor...');

  // Clean existing records in dependency order
  await prisma.auditLog.deleteMany();
  await prisma.storeOrder.deleteMany();
  await prisma.financialLedger.deleteMany();
  await prisma.technicalInspection.deleteMany();
  await prisma.transactionStatusHistory.deleteMany();
  await prisma.matchTransaction.deleteMany();
  await prisma.buyerRequest.deleteMany();
  await prisma.sellerOffer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = hashPassword('Go2Tek2026!');

  const adminUser = await prisma.user.create({
    data: {
      name: 'Emre Kaya (Genel Yönetici)',
      email: 'admin@go2tek.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const techUser = await prisma.user.create({
    data: {
      name: 'Burak Demir (Kıdemli Teknik Uzman)',
      email: 'teknik@go2tek.com',
      passwordHash,
      role: 'TECHNICAL_STAFF',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Selin Arslan (Satış & Eşleştirme Uzmanı)',
      email: 'satis@go2tek.com',
      passwordHash,
      role: 'SALES_STAFF',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Mert Yılmaz (Finans Yöneticisi)',
      email: 'finans@go2tek.com',
      passwordHash,
      role: 'FINANCE_STAFF',
    },
  });

  // Create Technical Inspections for Store Products & Transactions
  const insp1 = await prisma.technicalInspection.create({
    data: {
      inspectionCode: 'G2T-TK-2026-501',
      inspectorUserId: techUser.id,
      inspectorName: techUser.name,
      deviceBrandModel: 'Apple MacBook Pro 14" M2 Pro (2023)',
      deviceSerialNumber: 'C02MP2023X99',
      screenTest: 'PASS',
      keyboardTest: 'PASS',
      touchpadTest: 'PASS',
      usbPortsTest: 'PASS',
      wifiTest: 'PASS',
      cameraTest: 'PASS',
      speakerTest: 'PASS',
      microphoneTest: 'PASS',
      storageHealthTest: 'PASS',
      ramTest: 'PASS',
      cpuThermalTest: 'PASS',
      batteryHealthTest: 'PASS',
      chargerAdapterTest: 'PASS',
      cosmeticCheck: 'PASS',
      testDetailsJson: JSON.stringify({
        batteryCycles: 64,
        ssdHealthPercent: 99,
        maxTempCelsius: 72,
        deadPixels: 0,
      }),
      overallStatus: 'PASSED',
      summaryNotes:
        '14 noktalı Go2Tek donanım testinden tam puanla geçti. Pil döngüsü 64, sağlık %96. Orijinal 67W MagSafe 3 adaptör mevcut.',
      photos: JSON.stringify(['/images/products/macbook-pro-14.svg']),
    },
  });

  // Create Store Products across all 8 required categories
  const productsData = [
    {
      slug: 'apple-macbook-pro-14-m2-pro-16gb-512gb',
      sku: 'G2T-NB-101',
      title: 'Apple MacBook Pro 14" M2 Pro 16GB RAM 512GB SSD Uzay Grisi',
      description:
        'Go2Tek 14 Noktalı Teknik Kontrol Merkezinden onaylı, kutulu ve orijinal MagSafe 3 şarj adaptörlü MacBook Pro 14 inç. Liquid Retina XDR ekran, sıfır ölü piksel ve %96 pil sağlığı ile profesyonel yazılım, kurgu ve tasarım işleri için kusursuz kondisyondadır.',
      category: 'NOTEBOOK',
      brand: 'Apple',
      model: 'MacBook Pro 14" (A2779)',
      cpu: 'Apple M2 Pro (10 Çekirdek CPU)',
      ram: '16 GB Birleşik Bellek',
      ramGb: 16,
      storage: '512 GB NVMe PCIe 4.0 SSD',
      storageGb: 512,
      gpu: 'Apple M2 Pro 16-Core GPU',
      screenSize: '14.2" Liquid Retina XDR (3024x1964)',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%96 (64 Döngü)',
      images: JSON.stringify([
        '/images/products/macbook-pro-14.svg',
        '/images/products/macbook-pro-14-side.svg',
      ]),
      price: 58900,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '6 Ay Go2Tek Kurumsal Donanım Garantisi + 10 Ay Apple Türkiye Garantisi',
      technicalCheckSummary:
        'Ekran, klavye, touchpad, Thunderbolt 4 portları, SSD (%99 sağlık) ve termal stres testi eksiksiz onaylandı.',
      inspectionId: insp1.id,
      isPublished: true,
    },
    {
      slug: 'asus-rog-strix-g16-i7-13650hx-32gb-1tb-rtx4060',
      sku: 'G2T-NB-102',
      title: 'ASUS ROG Strix G16 i7-13650HX 32GB DDR5 1TB SSD RTX 4060 140W 16"',
      description:
        'Yüksek performanslı oyun ve mühendislik bilgisayarı. Sıvı metal termal kontrolü Go2Tek laboratuvarında test edilmiş, fan ve soğutma blokları sterilize edilmiştir. 165Hz FHD+ IPS ekran ve tam güç 140W RTX 4060 ekran kartı.',
      category: 'NOTEBOOK',
      brand: 'ASUS',
      model: 'ROG Strix G16 G614JV',
      cpu: 'Intel Core i7-13650HX (14 Çekirdek, 4.9GHz)',
      ram: '32 GB DDR5 4800MHz',
      ramGb: 32,
      storage: '1 TB PCIe 4.0 NVMe M.2 SSD',
      storageGb: 1024,
      gpu: 'NVIDIA GeForce RTX 4060 8GB GDDR6 (140W MUX Switch)',
      screenSize: '16.0" FHD+ 165Hz %100 sRGB G-Sync',
      cosmeticCondition: 'A',
      batteryHealth: '%91 (Orijinal 90Wh Batarya)',
      images: JSON.stringify(['/images/products/asus-rog-g16.svg']),
      price: 47500,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '12 Ay ASUS Türkiye + Go2Tek Teknik Güvence Sertifikası',
      technicalCheckSummary:
        '30 dakikalık FurMark ve Cinebench R23 stres testinde maksimum 78°C CPU, 71°C GPU sıcaklığı ölçüldü. Tüm portlar ve RGB klavye kusursuz.',
      isPublished: true,
    },
    {
      slug: 'lenovo-thinkpad-x1-carbon-gen10-i7-16gb-512gb',
      sku: 'G2T-NB-103',
      title: 'Lenovo ThinkPad X1 Carbon Gen 10 i7-1260P 16GB RAM 512GB SSD 14"',
      description:
        'Kurumsal profesyoneller için ultra hafif karbon fiber gövdeli iş bilgisayarı. Sadece 1.12 kg ağırlığında, askeri dayanıklılık standartlarında test edilmiş ve Go2Tek ekspertizinden geçmiştir.',
      category: 'NOTEBOOK',
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon Gen 10',
      cpu: 'Intel Core i7-1260P (12 Çekirdek)',
      ram: '16 GB LPDDR5 5200MHz',
      ramGb: 16,
      storage: '512 GB PCIe Gen4 NVMe SSD',
      storageGb: 512,
      gpu: 'Intel Iris Xe Graphics',
      screenSize: '14.0" WUXGA (1920x1200) IPS Mat',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%93 (Orijinal 57Wh)',
      images: JSON.stringify(['/images/products/thinkpad-x1.svg']),
      price: 36900,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '6 Ay Go2Tek Kurumsal Garanti',
      technicalCheckSummary:
        'Menteşe sertliği, TrackPoint, parmak izi okuyucu, Thunderbolt 4 portları ve NVMe sağlık (%98) testi başarılı.',
      isPublished: true,
    },
    {
      slug: 'apple-ipad-pro-12-9-m2-256gb-wifi-uzay-grisi',
      sku: 'G2T-TB-201',
      title: 'Apple iPad Pro 12.9" (6. Nesil) M2 Çip 256GB Wi-Fi Uzay Grisi',
      description:
        'Liquid Retina XDR Mini-LED ekranlı profesyonel tablet. Çiziksiz ekran, kutu ve orijinal Type-C şarj ekipmanıyla birlikte Go2Tek garantisi altında.',
      category: 'TABLET',
      brand: 'Apple',
      model: 'iPad Pro 12.9" 6. Nesil (A2436)',
      cpu: 'Apple M2 (8 Çekirdek CPU)',
      ram: '8 GB RAM',
      ramGb: 8,
      storage: '256 GB Dahili Depolama',
      storageGb: 256,
      gpu: 'Apple 10-Core GPU',
      screenSize: '12.9" Liquid Retina XDR ProMotion 120Hz',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%98 (29 Döngü)',
      images: JSON.stringify(['/images/products/ipad-pro-m2.svg']),
      price: 33500,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '8 Ay Apple Garantisi + 6 Ay Go2Tek Güvencesi',
      technicalCheckSummary:
        'TrueDepth FaceID, dörtlü hoparlör, Apple Pencil 2 manyetik şarj ve dokunmatik hassasiyet testlerinden tam not aldı.',
      isPublished: true,
    },
    {
      slug: 'samsung-galaxy-tab-s9-ultra-12gb-512gb',
      sku: 'G2T-TB-202',
      title: 'Samsung Galaxy Tab S9 Ultra 14.6" 12GB RAM 512GB S-Pen Dahil',
      description:
        'Dynamic AMOLED 2X 14.6 inç dev ekran, Snapdragon 8 Gen 2 işlemci ve kutu içi orijinal S-Pen kalemi ile çizim ve çoklu görevler için üst düzey Android tablet.',
      category: 'TABLET',
      brand: 'Samsung',
      model: 'Galaxy Tab S9 Ultra (SM-X910)',
      cpu: 'Qualcomm Snapdragon 8 Gen 2 for Galaxy',
      ram: '12 GB RAM',
      ramGb: 12,
      storage: '512 GB UFS 4.0',
      storageGb: 512,
      gpu: 'Adreno 740',
      screenSize: '14.6" Dynamic AMOLED 2X 120Hz',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%97 (11200 mAh)',
      images: JSON.stringify(['/images/products/tab-s9-ultra.svg']),
      price: 27800,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '10 Ay Samsung Türkiye Garantisi',
      technicalCheckSummary:
        'AMOLED piksel testi, S-Pen basınç hassasiyeti, Wi-Fi 6E ve batarya deşarj testi onaylandı.',
      isPublished: true,
    },
    {
      slug: 'go2tek-creator-workstation-r7-7700x-32gb-1tb-rtx4070s',
      sku: 'G2T-PC-301',
      title: 'Go2Tek StudioPro Masaüstü Bilgisayar Ryzen 7 7700X 32GB DDR5 1TB RTX 4070 Super',
      description:
        '3D render, yapay zeka geliştirme ve 2K/4K oyun performansı için tüm bileşenleri tek tek stres testinden geçirilmiş, sıfır ayarında masaüstü iş istasyonu.',
      category: 'DESKTOP',
      brand: 'Go2Tek Custom / MSI',
      model: 'StudioPro X70',
      cpu: 'AMD Ryzen 7 7700X (8 Çekirdek / 16 İzlek 5.4GHz)',
      ram: '32 GB (2x16) DDR5 6000MHz CL30',
      ramGb: 32,
      storage: '1 TB Kingston KC3000 PCIe 4.0 NVMe (7000MB/s)',
      storageGb: 1024,
      gpu: 'MSI GeForce RTX 4070 Super 12GB GDDR6X',
      screenSize: 'Masaüstü Kasa (Monitör Hariç)',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: 'Masaüstü PSU (750W 80+ Gold ATX 3.0)',
      images: JSON.stringify(['/images/products/desktop-workstation.svg']),
      price: 54900,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '12 Ay Go2Tek Sistem Garantisi + Parça Bazlı Distribitör Garantisi',
      technicalCheckSummary:
        'OCCT Power Supply testi, MemTest86 4 geçiş (%0 hata), 240mm sıvı soğutma pompa/fan devir kontrolü tamamlandı.',
      isPublished: true,
    },
    {
      slug: 'apple-mac-studio-m1-max-32gb-512gb',
      sku: 'G2T-PC-302',
      title: 'Apple Mac Studio M1 Max 10-Core CPU 24-Core GPU 32GB RAM 512GB SSD',
      description:
        'Kompakt gövdede devasa stüdyo performansı. Video prodüksiyon, müzik stüdyoları ve Xcode derleme süreçleri için sessiz ve ultra güçlü.',
      category: 'DESKTOP',
      brand: 'Apple',
      model: 'Mac Studio (MJMV3TU/A)',
      cpu: 'Apple M1 Max (10 Çekirdek)',
      ram: '32 GB Birleşik Bellek (400GB/s Bant Genişliği)',
      ramGb: 32,
      storage: '512 GB Apple NVMe SSD',
      storageGb: 512,
      gpu: 'Apple M1 Max 24-Core GPU',
      screenSize: 'Masaüstü (Harici 5 Ekran Destekli)',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: 'Dahili Güç Kaynağı (Sorunsuz)',
      images: JSON.stringify(['/images/products/mac-studio.svg']),
      price: 49500,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '6 Ay Go2Tek Donanım Garantisi',
      technicalCheckSummary:
        'Tüm Thunderbolt 4 portları, 10Gb Ethernet, HDMI ve dahili soğutma türbinleri test edildi.',
      isPublished: true,
    },
    {
      slug: 'dell-ultrasharp-u2723qe-27-4k-ips-black-monitor',
      sku: 'G2T-MN-401',
      title: 'Dell UltraSharp U2723QE 27" 4K UHD IPS Black 90W Type-C Hub Monitör',
      description:
        'MacBook ve iş bilgisayarları için tek kablo (90W Type-C) şarj ve görüntü aktarım destekli, 2000:1 kontrast oranlı IPS Black profesyonel renk monitörü.',
      category: 'MONITOR',
      brand: 'Dell',
      model: 'UltraSharp U2723QE',
      cpu: 'Dahili KVM & RJ45 Hub',
      ram: '-',
      ramGb: 0,
      storage: '-',
      storageGb: 0,
      gpu: '4K 3840x2160 @ 60Hz %98 DCI-P3',
      screenSize: '27.0" 4K IPS Black',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: 'AC Güç (Harici Adaptörsüz)',
      images: JSON.stringify(['/images/products/dell-monitor.svg']),
      price: 18400,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '6 Ay Go2Tek Sıfır Ölü Piksel Garantisi',
      technicalCheckSummary:
        'Kolorimetre ile renk sapması (Delta E < 1.5), 90W USB-C güç iletimi ve ölü piksel taraması yapıldı.',
      isPublished: true,
    },
    {
      slug: 'apple-iphone-15-pro-256gb-naturel-titanyum',
      sku: 'G2T-PH-501',
      title: 'Apple iPhone 15 Pro 256GB Natürel Titanyum (BTK Kayıtlı TR Cihazı)',
      description:
        'Türkiye resmi distribütör çıkışlı, hiç açılmamış ve tamir görmemiş, %95 pil sağlığında A+ kozmetik kondisyonda iPhone 15 Pro.',
      category: 'PHONE',
      brand: 'Apple',
      model: 'iPhone 15 Pro (A3102)',
      cpu: 'Apple A17 Pro (3nm)',
      ram: '8 GB LPDDR5',
      ramGb: 8,
      storage: '256 GB NVMe',
      storageGb: 256,
      gpu: 'Apple 6-Core GPU (Donanımsal Ray Tracing)',
      screenSize: '6.1" Super Retina XDR 120Hz',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%95 (140 Döngü)',
      images: JSON.stringify(['/images/products/iphone-15-pro.svg']),
      price: 59500,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '11 Ay Apple Türkiye Garantisi',
      technicalCheckSummary:
        'FaceID, LiDAR, 3x Telefoto kamera, TrueTone, mikrofon/ahize ve BTK IMEI sorgusu eksiksiz doğrulandı.',
      isPublished: true,
    },
    {
      slug: 'msi-rtx-3080-gaming-z-trio-10gb-ekran-karti',
      sku: 'G2T-PT-601',
      title: 'MSI GeForce RTX 3080 Gaming Z Trio 10GB GDDR6X 320-Bit Ekran Kartı',
      description:
        'Mining yapılmamış, yalnızca ev kullanıcısından alınarak Go2Tek laboratuvarında FurMark ve 3DMark TimeSpy stres testlerinden geçirilmiş üst segment ekran kartı.',
      category: 'PARTS',
      brand: 'MSI',
      model: 'RTX 3080 Gaming Z Trio 10G LHR',
      cpu: '8704 CUDA Çekirdeği',
      ram: '10 GB GDDR6X VRAM',
      ramGb: 10,
      storage: '-',
      storageGb: 0,
      gpu: 'NVIDIA GeForce RTX 3080 (320-Bit)',
      screenSize: '3x DisplayPort 1.4a + 1x HDMI 2.1',
      cosmeticCondition: 'A',
      batteryHealth: '3x 8-Pin PCIe Güç Girişi',
      images: JSON.stringify(['/images/products/rtx-gpu.svg']),
      price: 15900,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '6 Ay Go2Tek Test ve Çalışma Garantisi',
      technicalCheckSummary:
        '1080p ve 4K FurMark 45 dk yük altında maksimum 68°C çekirdek, 80°C VRAM sıcaklığı. Fan rulmanları sessiz.',
      isPublished: true,
    },
    {
      slug: 'logitech-mx-master-3s-ve-mx-keys-mini-set',
      sku: 'G2T-PR-701',
      title: 'Logitech MX Master 3S Kablosuz Mouse + MX Keys Mini Klavye Profesyonel Set',
      description:
        'Yazılımcılar ve tasarımcılar için sessiz tıklama özellikli MagSpeed tekerlekli MX Master 3S ve akıllı aydınlatmalı MX Keys Mini Türkçe Q klavye seti.',
      category: 'PERIPHERALS',
      brand: 'Logitech',
      model: 'MX Master 3S & MX Keys Mini Combo',
      cpu: 'Logi Bolt + Bluetooth LE',
      ram: '-',
      ramGb: 0,
      storage: '-',
      storageGb: 0,
      gpu: '8000 DPI Darkfield Sensör',
      screenSize: 'Kompakt Minimalist',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%99 (USB-C Şarjlı)',
      images: JSON.stringify(['/images/products/peripherals-set.svg']),
      price: 5450,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '6 Ay Go2Tek Garantisi',
      technicalCheckSummary:
        'Tüm tuş anahtarları, elektromanyetik tekerlek, sensör takibi ve Bluetooth/Bolt alıcı bağlantısı test edildi.',
      isPublished: true,
    },
    {
      slug: 'sony-playstation-5-slim-1tb-cift-dualsense',
      sku: 'G2T-OT-801',
      title: 'Sony PlayStation 5 Slim 1TB Dijital Sürüm + 2 Adet Orijinal DualSense Kol',
      description:
        'Kutu içeriği tam, analog drift (kayma) testi yapılmış iki adet orijinal DualSense kontrolcü ile birlikte sıfır ayarında PS5 Slim konsol.',
      category: 'OTHER',
      brand: 'Sony',
      model: 'PlayStation 5 Slim (CFI-2016)',
      cpu: 'AMD Zen 2 8-Core 3.5GHz',
      ram: '16 GB GDDR6',
      ramGb: 16,
      storage: '1 TB Özel Yüksek Hızlı NVMe SSD',
      storageGb: 1024,
      gpu: 'AMD RDNA 2 10.3 TFLOPS 4K 120Hz',
      screenSize: 'TV / Monitör Bağlantılı (HDMI 2.1)',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: 'DualSense Bataryalar %96+',
      images: JSON.stringify(['/images/products/ps5-slim.svg']),
      price: 21900,
      stockStatus: 'IN_STOCK',
      warrantyInfo: '6 Ay Go2Tek Konsol & Kol Garantisi',
      technicalCheckSummary:
        'Gamepad potansiyometre/drift testi (%0 sapma), HDMI 2.1 4K/120Hz çıkışı, PSN erişimi ve fan sesi kontrolü onaylandı.',
      isPublished: true,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  // Create Private Buyer Requests (NEVER public)
  const buyer1 = await prisma.buyerRequest.create({
    data: {
      referenceNo: 'G2T-AL-2026-1041',
      category: 'NOTEBOOK',
      brandPref: 'Apple',
      cpuPref: 'Apple M2 veya M3',
      ramPref: '16 GB',
      minRamGb: 16,
      storagePref: '512 GB SSD',
      minStorageGb: 512,
      gpuPref: 'Dahili Apple GPU',
      screenSizePref: '13.6" veya 15"',
      minBudget: 34000,
      maxBudget: 43000,
      cosmeticPref: 'A',
      usagePurpose: 'Mobil uygulama geliştirme (Xcode / React Native) ve günlük taşınabilirlik',
      additionalNotes: 'Pil sağlığı en az %90 olmalı, tamir görmemiş cihaz arıyorum.',
      fullName: 'Ahmet Karaca',
      phone: '05324108891',
      contactConsent: true,
      kvkkConsent: true,
      status: 'REVIEWING',
    },
  });

  const buyer2 = await prisma.buyerRequest.create({
    data: {
      referenceNo: 'G2T-AL-2026-1042',
      category: 'NOTEBOOK',
      brandPref: 'ASUS, MSI veya Monster',
      cpuPref: 'Intel i7 13. Nesil veya Ryzen 7',
      ramPref: '32 GB',
      minRamGb: 32,
      storagePref: '1 TB NVMe SSD',
      minStorageGb: 1024,
      gpuPref: 'RTX 4060 veya RTX 4070',
      screenSizePref: '15.6" veya 16" 144Hz+',
      minBudget: 40000,
      maxBudget: 48500,
      cosmeticPref: 'A',
      usagePurpose: 'Mimari 3D görselleştirme (Lumion, AutoCAD) ve oyun',
      additionalNotes: 'Isınma sorunu olmayan, Go2Tek stres testinden geçmiş bir cihaz istiyorum.',
      fullName: 'Zeynep Aydın',
      phone: '05443127760',
      contactConsent: true,
      kvkkConsent: true,
      status: 'MATCHED',
    },
  });

  const buyer3 = await prisma.buyerRequest.create({
    data: {
      referenceNo: 'G2T-AL-2026-1043',
      category: 'TABLET',
      brandPref: 'Apple',
      cpuPref: 'M2',
      ramPref: '8 GB',
      minRamGb: 8,
      storagePref: '256 GB',
      minStorageGb: 256,
      gpuPref: 'Apple GPU',
      screenSizePref: '11" veya 12.9"',
      minBudget: 25000,
      maxBudget: 31500,
      cosmeticPref: 'A_PLUS',
      usagePurpose: 'Dijital illüstrasyon (Procreate) ve üniversite ders notları',
      additionalNotes: 'Ekranda kesinlikle çizik olmamalı, kalemli teklifler öncelikli.',
      fullName: 'Caner Özkan',
      phone: '05358871920',
      contactConsent: true,
      kvkkConsent: true,
      status: 'NEW',
    },
  });

  const buyer4 = await prisma.buyerRequest.create({
    data: {
      referenceNo: 'G2T-AL-2026-1044',
      category: 'DESKTOP',
      brandPref: 'Farketmez (Kaliteli Bileşen)',
      cpuPref: 'Ryzen 7 7700 veya i7-13700',
      ramPref: '32 GB DDR5',
      minRamGb: 32,
      storagePref: '1 TB SSD',
      minStorageGb: 1024,
      gpuPref: 'RTX 4070 12GB',
      screenSizePref: 'Masaüstü Kasa',
      minBudget: 46000,
      maxBudget: 55000,
      cosmeticPref: 'A',
      usagePurpose: 'Video kurgu (DaVinci Resolve) ve Unreal Engine 5',
      additionalNotes: 'Fatura veya kutuları duran temiz bir sistem arıyorum.',
      fullName: 'Elif Çelik',
      phone: '05059124411',
      contactConsent: true,
      kvkkConsent: true,
      status: 'COMPLETED',
    },
  });

  // Create Private Seller Offers (NEVER public)
  const seller1 = await prisma.sellerOffer.create({
    data: {
      referenceNo: 'G2T-SAT-2026-2081',
      category: 'NOTEBOOK',
      brand: 'Apple',
      model: 'MacBook Air 15" M2 (2023)',
      serialNumber: 'C02M2981KLPQ',
      cpu: 'Apple M2 8-Core',
      ram: '16 GB Birleşik Bellek',
      ramGb: 16,
      storage: '512 GB SSD',
      storageGb: 512,
      gpu: 'Apple 10-Core GPU',
      screenSize: '15.3" Liquid Retina',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%94 (78 Döngü)',
      knownDefects: 'Hiçbir arızası veya kozmetik kusuru yoktur.',
      photos: JSON.stringify(['/images/products/macbook-pro-14.svg']),
      requestedPrice: 35500,
      fullName: 'Murat Şahin',
      phone: '05336194022',
      description: 'Şirket bilgisayarına geçtiğim için kutulu MacBook Air 15 cihazımı satıyorum.',
      contactConsent: true,
      kvkkConsent: true,
      status: 'REVIEWING',
    },
  });

  const seller2 = await prisma.sellerOffer.create({
    data: {
      referenceNo: 'G2T-SAT-2026-2082',
      category: 'NOTEBOOK',
      brand: 'Monster',
      model: 'Tulpar T7 V20.6',
      serialNumber: 'MNST8849201TR',
      cpu: 'Intel Core i7-13700H',
      ram: '32 GB DDR4 3200MHz',
      ramGb: 32,
      storage: '1 TB NVMe PCIe 4.0 SSD',
      storageGb: 1024,
      gpu: 'NVIDIA GeForce RTX 4060 8GB 140W',
      screenSize: '17.3" FHD 144Hz IPS',
      cosmeticCondition: 'A',
      batteryHealth: '%89',
      knownDefects: 'Çalışmayan aksamı yok; yalnızca alt kasada ufak kılcal iz mevcut.',
      photos: JSON.stringify(['/images/products/asus-rog-g16.svg']),
      requestedPrice: 39500,
      fullName: 'Hakan Koç',
      phone: '05427713099',
      description: 'Monster ömür boyu bakım garantisi devam ediyor, kutu ve faturası tam.',
      contactConsent: true,
      kvkkConsent: true,
      status: 'MATCHED',
    },
  });

  await prisma.sellerOffer.create({
    data: {
      referenceNo: 'G2T-SAT-2026-2083',
      category: 'TABLET',
      brand: 'Apple',
      model: 'iPad Pro 11" M2 Wi-Fi + Apple Pencil 2',
      serialNumber: 'DLX9928174AP',
      cpu: 'Apple M2',
      ram: '8 GB RAM',
      ramGb: 8,
      storage: '256 GB',
      storageGb: 256,
      gpu: 'Apple 10-Core GPU',
      screenSize: '11.0" Liquid Retina 120Hz',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: '%96',
      knownDefects: 'Kusursuz, ekran koruyucu ile kullanıldı.',
      photos: JSON.stringify(['/images/products/ipad-pro-m2.svg']),
      requestedPrice: 26500,
      fullName: 'Deniz Aksoy',
      phone: '05309918273',
      description: 'Orijinal Apple Pencil 2 ve manyetik kılıf fiyata dahildir.',
      contactConsent: true,
      kvkkConsent: true,
      status: 'NEW',
    },
  });

  const seller4 = await prisma.sellerOffer.create({
    data: {
      referenceNo: 'G2T-SAT-2026-2084',
      category: 'DESKTOP',
      brand: 'ASUS / AMD Özel Toplama',
      model: 'TUF Gaming R7-7700 & RTX 4070 Sistem',
      serialNumber: 'G2TDSK774012',
      cpu: 'AMD Ryzen 7 7700',
      ram: '32 GB DDR5 6000MHz',
      ramGb: 32,
      storage: '1 TB Samsung 980 Pro NVMe',
      storageGb: 1024,
      gpu: 'ASUS Dual RTX 4070 12GB',
      screenSize: 'Mid-Tower Akvaryum Kasa',
      cosmeticCondition: 'A_PLUS',
      batteryHealth: 'Corsair 750W 80+ Gold PSU',
      knownDefects: 'Hiçbir kusuru yok, tüm parçalar 14 ay daha garantili.',
      photos: JSON.stringify(['/images/products/desktop-workstation.svg']),
      requestedPrice: 44500,
      fullName: 'Gökhan Yıldırım',
      phone: '05361182290',
      description: 'Yurt dışına taşındığım için masaüstü sistemimi satıyorum.',
      contactConsent: true,
      kvkkConsent: true,
      status: 'PURCHASED',
    },
  });

  // Match Transaction 1: Active in Stage 9 (INSPECTION_IN_PROGRESS)
  const tx1 = await prisma.matchTransaction.create({
    data: {
      transactionCode: 'G2T-ISL-2026-9001',
      buyerRequestId: buyer2.id,
      sellerOfferId: seller2.id,
      matchScore: 93,
      matchAnalysisJson: JSON.stringify({
        budgetMatch: 30,
        brandModelMatch: 15,
        cpuMatch: 15,
        ramMatch: 15,
        storageMatch: 10,
        gpuMatch: 8,
        cosmeticMatch: 0,
        notes: [
          'Satıcı fiyatı (39.500 TL) + Go2Tek hizmet bedeli alıcının 48.500 TL bütçesine tam uyumlu.',
          'i7-13700H, 32GB RAM, 1TB SSD ve RTX 4060 donanım beklentilerini %100 karşılıyor.',
        ],
      }),
      currentStage: 'INSPECTION_IN_PROGRESS',
      assignedUserId: adminUser.id,
      assignedUserName: adminUser.name,
      adminNotes:
        'Alıcı Zeynep Hanım ile görüşüldü, 45.000 TL anahtar teslim fiyat onaylandı. 5.000 TL kapora banka dekontu doğrulandı. Satıcı Hakan Bey cihazı Go2Tek merkezine teslim etti, şu an Burak Bey teknik kontrolleri yapıyor.',
    },
  });

  const tx1Stages = [
    { from: null, to: 'NEW_REQUEST', note: 'Alıcı talebi ve satıcı teklifi havuza alındı.' },
    { from: 'NEW_REQUEST', to: 'MATCH_PROPOSED', note: '%93 uyum skoru ile eşleştirme önerisi oluşturuldu.' },
    { from: 'MATCH_PROPOSED', to: 'BUYER_CONTACTED', note: 'Alıcı Zeynep Aydın ile telefon görüşmesi yapıldı.' },
    { from: 'BUYER_CONTACTED', to: 'BUYER_ACCEPTED', note: 'Alıcı cihaz özelliklerini ve 45.000 TL satış fiyatını kabul etti.' },
    { from: 'BUYER_ACCEPTED', to: 'DEPOSIT_PENDING', note: 'Kapora için kurumsal IBAN/ödeme bilgileri paylaşıldı.' },
    { from: 'DEPOSIT_PENDING', to: 'DEPOSIT_RECEIVED', note: '5.000 TL kapora ödemesi TR-DEKONT-2026-4410 referansı ile doğrulandı.' },
    { from: 'DEPOSIT_RECEIVED', to: 'SELLER_AGREED', note: 'Satıcı Hakan Koç ile 39.500 TL alım bedeli üzerinde anlaşma sağlandı.' },
    { from: 'SELLER_AGREED', to: 'DEVICE_RECEIVED', note: 'Cihaz Go2Tek Kadıköy Teknik Merkezine teslim alındı.' },
    { from: 'DEVICE_RECEIVED', to: 'INSPECTION_IN_PROGRESS', note: '14 noktalı donanım ve termal stres testleri başlatıldı.' },
  ];

  for (const h of tx1Stages) {
    await prisma.transactionStatusHistory.create({
      data: {
        transactionId: tx1.id,
        fromStage: h.from,
        toStage: h.to,
        changedByUserId: adminUser.id,
        changedByName: adminUser.name,
        note: h.note,
      },
    });
  }

  await prisma.financialLedger.create({
    data: {
      transactionId: tx1.id,
      sellerPurchasePrice: 39500,
      buyerSalePrice: 45000,
      depositAmount: 5000,
      depositStatus: 'VERIFIED_PAID',
      depositVerificationRef: 'TR-DEKONT-2026-4410',
      remainingAmount: 40000,
      remainingPaymentStatus: 'NOT_PAID',
      shippingCost: 450,
      inspectionCost: 400,
      repairCost: 350, // Termal macun yenileme
      taxAndOtherCosts: 800,
      estimatedGrossProfit: 5500,
      estimatedNetProfit: 3500,
      actualGrossProfit: 0,
      actualNetProfit: 0,
    },
  });

  // Match Transaction 2: Completed (Stage 13 - COMPLETED)
  const tx2 = await prisma.matchTransaction.create({
    data: {
      transactionCode: 'G2T-ISL-2026-9002',
      buyerRequestId: buyer4.id,
      sellerOfferId: seller4.id,
      matchScore: 96,
      matchAnalysisJson: JSON.stringify({
        budgetMatch: 30,
        brandModelMatch: 15,
        cpuMatch: 15,
        ramMatch: 15,
        storageMatch: 10,
        gpuMatch: 8,
        cosmeticMatch: 3,
        notes: [
          'Ryzen 7 7700 + 32GB DDR5 + 1TB NVMe + RTX 4070 12GB tam eşleşme.',
        ],
      }),
      currentStage: 'COMPLETED',
      assignedUserId: adminUser.id,
      assignedUserName: adminUser.name,
      adminNotes:
        '14 kriterli teknik kontrol başarıyla tamamlandı, kalan ödeme tahsil edildi ve cihaz alıcı Elif Hanım’a teslim edilerek süreç kapatıldı.',
    },
  });

  await prisma.transactionStatusHistory.create({
    data: {
      transactionId: tx2.id,
      fromStage: 'DELIVERED_TO_BUYER',
      toStage: 'COMPLETED',
      changedByUserId: adminUser.id,
      changedByName: adminUser.name,
      note: 'Alıcı teslim onayı alındı, satıcı ve Go2Tek mutabakatı tamamlandı.',
    },
  });

  await prisma.technicalInspection.create({
    data: {
      inspectionCode: 'G2T-TK-2026-502',
      transactionId: tx2.id,
      sellerOfferId: seller4.id,
      inspectorUserId: techUser.id,
      inspectorName: techUser.name,
      deviceBrandModel: 'ASUS TUF Gaming R7-7700 & RTX 4070 Masaüstü Sistem',
      deviceSerialNumber: 'G2TDSK774012',
      screenTest: 'PASS',
      keyboardTest: 'PASS',
      touchpadTest: 'PASS',
      usbPortsTest: 'PASS',
      wifiTest: 'PASS',
      cameraTest: 'PASS',
      speakerTest: 'PASS',
      microphoneTest: 'PASS',
      storageHealthTest: 'PASS',
      ramTest: 'PASS',
      cpuThermalTest: 'PASS',
      batteryHealthTest: 'PASS',
      chargerAdapterTest: 'PASS',
      cosmeticCheck: 'PASS',
      overallStatus: 'PASSED',
      summaryNotes:
        'Samsung 980 Pro SSD sağlık %100, DDR5 EXPO 6000MHz MemTest86 hatasız, RTX 4070 tam yükte 66°C. Satışa ve teslime uygun.',
      photos: JSON.stringify(['/images/products/desktop-workstation.svg']),
    },
  });

  await prisma.financialLedger.create({
    data: {
      transactionId: tx2.id,
      sellerPurchasePrice: 44500,
      buyerSalePrice: 51500,
      depositAmount: 7500,
      depositStatus: 'VERIFIED_PAID',
      depositVerificationRef: 'TR-DEKONT-2026-3819',
      remainingAmount: 0,
      remainingPaymentStatus: 'VERIFIED_PAID',
      shippingCost: 650,
      inspectionCost: 450,
      repairCost: 0,
      taxAndOtherCosts: 1100,
      estimatedGrossProfit: 7000,
      estimatedNetProfit: 4800,
      actualGrossProfit: 7000,
      actualNetProfit: 4800,
    },
  });

  // Match Transaction 3: Proposed Match (Stage 2 - MATCH_PROPOSED) for Buyer 1 & Seller 1
  const tx3 = await prisma.matchTransaction.create({
    data: {
      transactionCode: 'G2T-ISL-2026-9003',
      buyerRequestId: buyer1.id,
      sellerOfferId: seller1.id,
      matchScore: 95,
      matchAnalysisJson: JSON.stringify({
        budgetMatch: 30,
        brandModelMatch: 15,
        cpuMatch: 15,
        ramMatch: 15,
        storageMatch: 10,
        gpuMatch: 8,
        cosmeticMatch: 2,
        notes: [
          'MacBook Air 15" M2 16GB/512GB cihaz, Ahmet Karaca’nın 34.000-43.000 TL bütçesine ve M2/16GB/512GB talebine %95 oranında uyuyor.',
        ],
      }),
      currentStage: 'MATCH_PROPOSED',
      assignedUserId: adminUser.id,
      assignedUserName: adminUser.name,
      adminNotes: 'Eşleştirme önerildi. Yönetici onayı ile alıcı aranacak.',
    },
  });

  await prisma.transactionStatusHistory.create({
    data: {
      transactionId: tx3.id,
      fromStage: 'NEW_REQUEST',
      toStage: 'MATCH_PROPOSED',
      changedByUserId: adminUser.id,
      changedByName: adminUser.name,
      note: 'Eşleştirme motoru tarafından %95 uyum skoru ile önerildi.',
    },
  });

  await prisma.financialLedger.create({
    data: {
      transactionId: tx3.id,
      sellerPurchasePrice: 35500,
      buyerSalePrice: 39900,
      depositAmount: 4000,
      depositStatus: 'NOT_PAID',
      depositVerificationRef: '',
      remainingAmount: 39900,
      remainingPaymentStatus: 'NOT_PAID',
      shippingCost: 350,
      inspectionCost: 350,
      repairCost: 0,
      taxAndOtherCosts: 700,
      estimatedGrossProfit: 4400,
      estimatedNetProfit: 3000,
      actualGrossProfit: 0,
      actualNetProfit: 0,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      userEmail: adminUser.email,
      userRole: adminUser.role,
      action: 'SYSTEM_SEED_INITIALIZED',
      entityType: 'System',
      entityId: 'INIT',
      details: 'Go2Tek başlangıç verileri, mağaza stoğu ve özel talep/teklif kayıtları oluşturuldu.',
    },
  });

  console.log('Go2Tek veritabanı başarıyla hazırlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
