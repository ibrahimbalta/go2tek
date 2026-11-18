import { prisma } from './prisma';

export interface SiteSettingsData {
  siteTitle: string;
  topBarText: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  footerDescription: string;
  slogan: string;
  bannerTitle: string;
  bannerDescription: string;
  aboutLeadText: string;
}

export interface HeroSlideData {
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

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  siteTitle: 'Go2Tek | Bartın 2.El Teknoloji Mağazası & Özel Talep Eşleştirme',
  topBarText: 'Go2Tek Bartın 2.El Teknoloji Mağazası • Alım - Satım - Takas',
  phone: '0 (545) 346 79 86',
  whatsappNumber: '905453467986',
  email: 'iletisim@go2tek.com',
  address: 'Bartın / Merkez',
  workingHours: 'Pazartesi – Cumartesi: 09:00 – 19:00',
  footerDescription:
    'Go2Tek; test edilmiş bilgisayar, notebook, tablet, telefon ve teknolojik ürünleri Bartınlılara uygun fiyatlarla sunan, değerinde alım ve takas hizmeti veren güvenilir teknoloji mağazasıdır.',
  slogan: 'Teknolojide Doğru Adres!',
  bannerTitle: 'Kontrol Edilmiş Cihazlar ve Şeffaf Ürün Bilgisi',
  bannerDescription:
    'Mağazamızdaki ve özel talep sistemimizdeki cihazların ekran, klavye, batarya ve temel donanım kontrolleri yapılarak mevcut kozmetik durumları açık ve şeffaf şekilde paylaşılır.',
  aboutLeadText:
    'Go2Tek; Bartın’da test edilmiş ikinci el bilgisayar ve teknolojik araçları uygun fiyata sunan, değerinde alım ve takas hizmeti veren güvenilir bir teknoloji girişimidir.',
};

export const DEFAULT_HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'vitrin-notebook',
    tabTitle: 'Notebook & MacBook Fırsatları',
    badge: 'GO2TEK MAĞAZA VİTRİNİ',
    titlePrefix: 'Temiz ve Bakımlı ',
    titleHighlight: '2.El MacBook & Notebook',
    titleSuffix: ' Fırsatları',
    description:
      'Go2Tek mağazamızdaki ikinci el bilgisayarlar genel çalışma kontrolleri yapılarak, kozmetik durumu ve cihaz özellikleri şeffaf biçimde belirtilerek satışa sunulur.',
    features: [
      'Genel Çalışma Kontrolleri Yapılmış Cihazlar',
      'Şeffaf Kozmetik ve Pil Durumu Bilgisi',
      'Hızlı Kargo veya Mağazadan Görerek Teslim',
    ],
    featuredCard: {
      tag: 'Haftanın Vitrin Ürünü • Temiz Cihaz',
      name: 'Apple MacBook Pro 14" M2 Pro',
      specs: '16 GB RAM • 512 GB NVMe SSD • %96 Pil',
      oldPrice: '63.500 TL',
      price: '58.900 TL',
      href: '/urun/apple-macbook-pro-14-m2-pro-16gb-512gb',
    },
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Mağaza Ürünlerini Keşfet',
      href: '/magaza',
    },
    secondaryCta: {
      label: 'Notebook Kategorisi',
      href: '/magaza/notebook',
    },
  },
  {
    id: 'butceme-gore-bul',
    tabTitle: 'Bütçeme Göre Cihaz Bul',
    badge: 'ÖZEL TALEP EŞLEŞTİRME SİSTEMİ',
    titlePrefix: 'Bütçenizi Yazın, ',
    titleHighlight: 'İstediğiniz Cihazı',
    titleSuffix: ' Sizin İçin Araştırıp Bulalım',
    description:
      'Aradığınız cihaz mağaza stoğumuzda yoksa bütçenizi ve istediğiniz özellikleri girin. Başvurunuz herkese açık ilan olmaz; satıcı portföyümüzden size uygun cihazı bulup iletişime geçeriz.',
    features: [
      'Herkese Açık İlan Yayınlanmaz (Gizli Başvuru)',
      'Bütçe ve Donanım Tercihinize Göre Eşleştirme',
      'Teslimat Öncesi Genel Cihaz Kontrolü',
    ],
    featuredCard: {
      tag: 'Özel Alıcı Talep Sistemi',
      name: 'Bütçenize Uygun Cihaz Araştırması',
      specs: 'Notebook • Masaüstü PC • Tablet • Telefon',
      price: 'Bütçenize Özel Teklif',
      href: '/butceme-gore-cihaz-bul',
    },
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Bütçeme Göre Cihaz Bul',
      href: '/butceme-gore-cihaz-bul',
    },
    secondaryCta: {
      label: 'Başvuru Sorgula',
      href: '/basvuru-sorgula',
    },
  },
  {
    id: 'cihazimi-sat',
    tabTitle: 'Cihazını Değerinde Sat / Takas',
    badge: 'ALIM • SATIM • TAKAS MERKEZİ',
    titlePrefix: 'Cihazınızı Açık İlanlarla Uğraşmadan ',
    titleHighlight: 'Go2Tek Güvencesiyle',
    titleSuffix: ' Değerinde Satın',
    description:
      'Satmak istediğiniz notebook, bilgisayar, telefon veya tabletin özelliklerini ve istediğiniz fiyatı gönderin. Telefon numaranız kimseyle paylaşılmadan süreci Go2Tek yönetsin.',
    features: [
      'Kişisel Bilgileriniz & Telefonunuz Gizli Tutulur',
      'Değerinde Satış veya Takas Değerlendirmesi',
      'Hızlı Ön İnceleme ve Güvenli İşlem Süreci',
    ],
    featuredCard: {
      tag: 'Hızlı & Güvenli Satış Süreci',
      name: '2.El Bilgisayar, Telefon & Tablet Alımı',
      specs: 'Açık İlan Karmaşası Yok • Doğrudan Mağaza Süreci',
      price: 'Hemen Teklif Oluşturun',
      href: '/cihazimi-satmak-istiyorum',
    },
    image:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Cihazımı Satmak İstiyorum',
      href: '/cihazimi-satmak-istiyorum',
    },
    secondaryCta: {
      label: 'Nasıl Çalışır?',
      href: '/hakkimizda',
    },
  },
  {
    id: 'gaming-ve-mobil',
    tabTitle: 'Gaming PC, iPhone & iPad',
    badge: 'PERFORMANS & MOBİL VİTRİNİ',
    titlePrefix: 'Bakımlı ',
    titleHighlight: 'Gaming Bilgisayarlar',
    titleSuffix: ' ve Temiz iPhone / iPad Modelleri',
    description:
      'Oyun, çizim ve günlük kullanım için temiz kullanılmış RTX serisi bilgisayarlar ile Türkiye kayıtlı iPhone ve iPad modelleri uygun fiyatlarla mağazamızda.',
    features: [
      'Bakımları Yapılmış Masaüstü ve Gaming Sistemler',
      'BTK Kayıtlı, Temiz Kullanılmış Telefon ve Tabletler',
      'Şeffaf Fiyatlandırma ve Kolay Sipariş',
    ],
    featuredCard: {
      tag: 'Gaming & Performans Serisi',
      name: 'ASUS ROG Strix G16 RTX 4060',
      specs: 'i7-13650HX • 32 GB DDR5 • 1 TB NVMe SSD • 165Hz',
      oldPrice: '51.500 TL',
      price: '47.500 TL',
      href: '/urun/asus-rog-strix-g16-i7-13650hx-32gb-1tb-rtx4060',
    },
    image:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=85',
    primaryCta: {
      label: 'Gaming & PC Stoklarını Gör',
      href: '/magaza/masaustu-bilgisayar',
    },
    secondaryCta: {
      label: 'Telefon & Tabletleri Gör',
      href: '/magaza/tablet',
    },
  },
];

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const row = await prisma.siteConfig.findUnique({
      where: { key: 'site_settings' },
    });
    if (!row) return DEFAULT_SITE_SETTINGS;
    return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(row.valueJson) };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettingsData): Promise<void> {
  const json = JSON.stringify(settings);
  await prisma.siteConfig.upsert({
    where: { key: 'site_settings' },
    create: { key: 'site_settings', valueJson: json },
    update: { valueJson: json },
  });
}

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    const row = await prisma.siteConfig.findUnique({
      where: { key: 'hero_slides' },
    });
    if (!row) return DEFAULT_HERO_SLIDES;
    const parsed = JSON.parse(row.valueJson);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_HERO_SLIDES;
  } catch {
    return DEFAULT_HERO_SLIDES;
  }
}

export async function saveHeroSlides(slides: HeroSlideData[]): Promise<void> {
  const json = JSON.stringify(slides);
  await prisma.siteConfig.upsert({
    where: { key: 'hero_slides' },
    create: { key: 'hero_slides', valueJson: json },
    update: { valueJson: json },
  });
}
