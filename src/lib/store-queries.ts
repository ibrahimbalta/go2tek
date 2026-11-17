import { prisma } from './prisma';

export interface StoreProductRecord {
  id: string;
  slug: string;
  sku: string;
  title: string;
  description: string;
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
  images: string;
  price: number;
  stockStatus: string;
  warrantyInfo: string;
  technicalCheckSummary: string;
  inspectionId: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const FALLBACK_PRODUCTS: StoreProductRecord[] = [
  {
    id: 'fallback-nb-101',
    slug: 'apple-macbook-pro-14-m2-pro-16gb-512gb',
    sku: 'G2T-NB-101',
    title: 'Apple MacBook Pro 14" M2 Pro 16GB RAM 512GB SSD Uzay Grisi',
    description:
      'Kutulu ve orijinal MagSafe 3 şarj adaptörlü MacBook Pro 14 inç. Liquid Retina XDR ekran, sıfır ölü piksel ve %96 pil sağlığı ile profesyonel yazılım, kurgu ve tasarım işleri için temiz kondisyondadır.',
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
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 58900,
    stockStatus: 'IN_STOCK',
    warrantyInfo: 'Devam Eden Apple Garantisi (10 Ay) • Mağaza Kontrolü Yapılmış',
    technicalCheckSummary:
      'Ekran, klavye, touchpad, bağlantı portları ve şarj durumu mağazamızda kontrol edilmiştir.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T10:00:00Z'),
    updatedAt: new Date('2026-11-10T10:00:00Z'),
  },
  {
    id: 'fallback-nb-102',
    slug: 'asus-rog-strix-g16-i7-13650hx-32gb-1tb-rtx4060',
    sku: 'G2T-NB-102',
    title: 'ASUS ROG Strix G16 i7-13650HX 32GB DDR5 1TB SSD RTX 4060 140W 16"',
    description:
      'Yüksek performanslı oyun ve mühendislik bilgisayarı. 165Hz FHD+ IPS ekran ve tam güç 140W RTX 4060 ekran kartı.',
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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 47500,
    stockStatus: 'IN_STOCK',
    warrantyInfo: 'Devam Eden ASUS Türkiye Garantisi • Mağaza Kontrolü Yapılmış',
    technicalCheckSummary:
      'Genel çalışma, fan/soğutma, ekran, klavye ve port kontrolleri mağazamızda yapılmıştır.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T09:00:00Z'),
    updatedAt: new Date('2026-11-10T09:00:00Z'),
  },
  {
    id: 'fallback-nb-103',
    slug: 'lenovo-thinkpad-x1-carbon-gen10-i7-16gb-512gb',
    sku: 'G2T-NB-103',
    title: 'Lenovo ThinkPad X1 Carbon Gen 10 i7-1260P 16GB RAM 512GB SSD 14"',
    description:
      'Kurumsal profesyoneller için ultra hafif karbon fiber gövdeli iş bilgisayarı. Sadece 1.12 kg ağırlığında, temiz kondisyonda.',
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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 36900,
    stockStatus: 'IN_STOCK',
    warrantyInfo: 'Mağaza Kontrolü Yapılmış • Teslimat Kontrol Güvenceli',
    technicalCheckSummary:
      'Menteşe, klavye, ekran, batarya ve genel çalışma kontrolleri mağazamızda yapılmıştır.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T08:00:00Z'),
    updatedAt: new Date('2026-11-10T08:00:00Z'),
  },
  {
    id: 'fallback-tb-201',
    slug: 'apple-ipad-pro-12-9-m2-256gb-wifi-uzay-grisi',
    sku: 'G2T-TB-201',
    title: 'Apple iPad Pro 12.9" (6. Nesil) M2 Çip 256GB Wi-Fi Uzay Grisi',
    description:
      'Liquid Retina XDR Mini-LED ekranlı profesyonel tablet. Çiziksiz ekran, kutu ve orijinal Type-C şarj ekipmanıyla birlikte.',
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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 33500,
    stockStatus: 'IN_STOCK',
    warrantyInfo: 'Devam Eden Apple Garantisi (8 Ay) • Mağaza Kontrolü Yapılmış',
    technicalCheckSummary:
      'Ekran dokunmatiği, FaceID, hoparlör ve şarj soketi kontrolleri mağazamızda yapılmıştır.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T07:00:00Z'),
    updatedAt: new Date('2026-11-10T07:00:00Z'),
  },
  {
    id: 'fallback-pc-301',
    slug: 'go2tek-creator-workstation-r7-7700x-32gb-1tb-rtx4070s',
    sku: 'G2T-PC-301',
    title:
      'Go2Tek StudioPro Masaüstü Bilgisayar Ryzen 7 7700X 32GB DDR5 1TB RTX 4070 Super',
    description:
      '3D render, yapay zeka geliştirme ve 2K/4K oyun performansı için temiz ve bakımlı masaüstü iş istasyonu.',
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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 54900,
    stockStatus: 'IN_STOCK',
    warrantyInfo: 'Mağaza Kontrolü Yapılmış • Parça Kutuları Mevcut',
    technicalCheckSummary:
      'Tüm bileşenlerin genel çalışma, ekran kartı, bellek ve soğutma kontrolleri yapılmıştır.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T06:00:00Z'),
    updatedAt: new Date('2026-11-10T06:00:00Z'),
  },
  {
    id: 'fallback-mn-401',
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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 18400,
    stockStatus: 'IN_STOCK',
    warrantyInfo: 'Mağaza Kontrolü Yapılmış • Sorunsuz Panel',
    technicalCheckSummary:
      'Panel görüntü kalitesi, Type-C bağlantı ve port kontrolleri mağazamızda yapılmıştır.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T05:00:00Z'),
    updatedAt: new Date('2026-11-10T05:00:00Z'),
  },
  {
    id: 'fallback-ph-501',
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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 59500,
    stockStatus: 'IN_STOCK',
    warrantyInfo: '11 Ay Apple Türkiye Garantisi',
    technicalCheckSummary:
      'FaceID, kamera, mikrofon ve BTK IMEI sorgusu mağazamızda kontrol edilmiştir.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T04:00:00Z'),
    updatedAt: new Date('2026-11-10T04:00:00Z'),
  },
  {
    id: 'fallback-ot-801',
    slug: 'sony-playstation-5-slim-1tb-cift-dualsense',
    sku: 'G2T-OT-801',
    title: 'Sony PlayStation 5 Slim 1TB Dijital Sürüm + 2 Adet Orijinal DualSense Kol',
    description:
      'Kutu içeriği tam, iki adet orijinal DualSense kontrolcü ile birlikte temiz kondisyonda PS5 Slim konsol.',
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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=85',
    ]),
    price: 21900,
    stockStatus: 'IN_STOCK',
    warrantyInfo: 'Mağaza Kontrolü Yapılmış • Çift Kol Dahil',
    technicalCheckSummary:
      'Konsol çalışması, HDMI görüntü çıkışı ve DualSense kol kontrolleri mağazamızda yapılmıştır.',
    inspectionId: null,
    isPublished: true,
    createdAt: new Date('2026-11-10T03:00:00Z'),
    updatedAt: new Date('2026-11-10T03:00:00Z'),
  },
];

export async function getPublishedProducts(options?: {
  categories?: string[];
  take?: number;
}): Promise<StoreProductRecord[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        ...(options?.categories ? { category: { in: options.categories } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      ...(options?.take ? { take: options.take } : {}),
    });
    return products;
  } catch {
    let list = FALLBACK_PRODUCTS.filter((p) => p.isPublished);
    if (options?.categories) {
      list = list.filter((p) => options.categories!.includes(p.category));
    }
    if (options?.take) {
      list = list.slice(0, options.take);
    }
    return list;
  }
}

export async function getPublishedProductBySlug(
  slug: string
): Promise<StoreProductRecord | null> {
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product || !product.isPublished) return null;
    return product;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug && p.isPublished) || null;
  }
}
