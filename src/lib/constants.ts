export interface TransactionStageMeta {
  step: number;
  key: string;
  label: string;
  description: string;
  badgeColor: string;
}

export const TRANSACTION_STAGES: TransactionStageMeta[] = [
  { step: 1, key: 'NEW_REQUEST', label: 'Yeni talep', description: 'Alıcı talebi ve satıcı teklifi incelemeye alındı.', badgeColor: 'bg-slate-100 text-slate-800' },
  { step: 2, key: 'MATCH_PROPOSED', label: 'Eşleşme önerildi', description: 'Yönetici tarafından uygun alıcı ve satıcı eşleştirmesi oluşturuldu.', badgeColor: 'bg-blue-100 text-blue-800' },
  { step: 3, key: 'BUYER_CONTACTED', label: 'Alıcıyla iletişim kuruldu', description: 'Go2Tek uzmanı alıcıya cihaz özelliklerini ve fiyatını iletti.', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { step: 4, key: 'BUYER_ACCEPTED', label: 'Alıcı kabul etti', description: 'Alıcı önerilen cihazı ve koşulları onayladı.', badgeColor: 'bg-cyan-100 text-cyan-800' },
  { step: 5, key: 'DEPOSIT_PENDING', label: 'Kapora bekleniyor', description: 'Cihazın rezerve edilmesi ve tedarik süreci için kapora ödemesi bekleniyor.', badgeColor: 'bg-amber-100 text-amber-800' },
  { step: 6, key: 'DEPOSIT_RECEIVED', label: 'Kapora alındı', description: 'Kapora tahsilatı doğrulandı ve kayıt altına alındı.', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { step: 7, key: 'SELLER_AGREED', label: 'Satıcıyla anlaşma sağlandı', description: 'Satıcı ile nihai alım şartları ve cihaz gönderimi konusunda mutabık kalındı.', badgeColor: 'bg-teal-100 text-teal-800' },
  { step: 8, key: 'DEVICE_RECEIVED', label: 'Cihaz teslim alındı', description: 'Cihaz Go2Tek teknik merkezine ulaştı.', badgeColor: 'bg-purple-100 text-purple-800' },
  { step: 9, key: 'INSPECTION_IN_PROGRESS', label: 'Teknik kontrol yapılıyor', description: '14 noktalı donanım, stres ve kozmetik testleri uygulanıyor.', badgeColor: 'bg-amber-100 text-amber-900' },
  { step: 10, key: 'INSPECTION_PASSED', label: 'Teknik kontrolden geçti', description: 'Cihaz tüm Go2Tek kalite ve donanım standartlarını başarıyla geçti.', badgeColor: 'bg-green-100 text-green-800' },
  { step: 11, key: 'READY_FOR_SALE', label: 'Satışa hazır', description: 'Kontrolleri tamamlanan cihaz kalan ödeme ve sevk için hazır.', badgeColor: 'bg-blue-100 text-blue-900' },
  { step: 12, key: 'DELIVERED_TO_BUYER', label: 'Alıcıya teslim edildi', description: 'Cihaz alıcıya kargo veya elden teslim edildi.', badgeColor: 'bg-indigo-100 text-indigo-900' },
  { step: 13, key: 'COMPLETED', label: 'İşlem tamamlandı', description: 'Alım-satım ve ödeme süreçleri eksiksiz tamamlandı.', badgeColor: 'bg-emerald-200 text-emerald-950' },
  { step: 14, key: 'CANCELLED', label: 'İptal edildi', description: 'İşlem yönetici veya taraf talebiyle iptal edildi.', badgeColor: 'bg-rose-100 text-rose-800' },
  { step: 15, key: 'RETURN_DISPUTE', label: 'İade/uyuşmazlık sürecinde', description: 'İade veya teknik uyuşmazlık incelemesi yürütülüyor.', badgeColor: 'bg-orange-100 text-orange-900' },
];

export interface InspectionCriterionMeta {
  index: number;
  field: string;
  label: string;
  description: string;
}

export const INSPECTION_CRITERIA: InspectionCriterionMeta[] = [
  { index: 1, field: 'screenTest', label: 'Ekran testi', description: 'Ölü piksel, ışık sızması, parlaklık ve renk doğruluğu' },
  { index: 2, field: 'keyboardTest', label: 'Klavye testi', description: 'Tüm tuşların basım hissi, tepkimesi ve arka aydınlatma' },
  { index: 3, field: 'touchpadTest', label: 'Touchpad testi', description: 'Çoklu dokunmatik yüzey ve tıklama mekanizması' },
  { index: 4, field: 'usbPortsTest', label: 'USB ve bağlantı noktaları', description: 'Type-C, USB-A, HDMI, Thunderbolt ve şarj soketi' },
  { index: 5, field: 'wifiTest', label: 'Wi-Fi', description: 'Kablosuz ağ çekim gücü, kararlılık ve Bluetooth bağlantısı' },
  { index: 6, field: 'cameraTest', label: 'Kamera', description: 'Web kamerası görüntü netliği ve sensör çalışması' },
  { index: 7, field: 'speakerTest', label: 'Hoparlör', description: 'Sağ/sol kanal ses yüksekliği ve cızırtı kontrolü' },
  { index: 8, field: 'microphoneTest', label: 'Mikrofon', description: 'Ses kayıt netliği ve gürültü engelleme testi' },
  { index: 9, field: 'storageHealthTest', label: 'SSD/HDD sağlık durumu', description: 'S.M.A.R.T. verileri, okuma/yazma hızı ve bad sector taraması' },
  { index: 10, field: 'ramTest', label: 'RAM testi', description: 'Bellek adresleme ve kararlılık (MemTest) kontrolü' },
  { index: 11, field: 'cpuThermalTest', label: 'İşlemci ve sıcaklık kontrolü', description: 'Tam yük altında stres testi, fan sesi ve termal değerler' },
  { index: 12, field: 'batteryHealthTest', label: 'Pil sağlığı', description: 'Şarj döngüsü (cycle), tasarım kapasitesi ve deşarj süresi' },
  { index: 13, field: 'chargerAdapterTest', label: 'Şarj adaptörü', description: 'Orijinallik, voltaj/amper kararlılığı ve kablo sağlamlığı' },
  { index: 14, field: 'cosmeticCheck', label: 'Kozmetik kontrol', description: 'Kasa, menteşe, köşe ve yüzey kozmetik derecelendirmesi' },
];

export interface ProductCategoryMeta {
  key: string;
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  { key: 'NOTEBOOK', slug: 'notebook', label: 'İkinci El Notebook', shortLabel: 'Notebook', description: 'Test edilmiş MacBook, Ultrabook, İş İstasyonu ve Gaming Лаptoplar' },
  { key: 'TABLET', slug: 'tablet', label: 'Tablet', shortLabel: 'Tablet', description: 'iPad Pro, iPad Air, Samsung Galaxy Tab ve Grafik Tabletler' },
  { key: 'DESKTOP', slug: 'masaustu-bilgisayar', label: 'Masaüstü Bilgisayar', shortLabel: 'Masaüstü Bilgisayar', description: 'Hazır Sistemler, iMac, Mac Studio, Mini PC ve İş İstasyonları' },
  { key: 'MONITOR', slug: 'monitor', label: 'Monitör', shortLabel: 'Monitör', description: 'Oyuncu, Tasarım ve Ofis Monitörleri' },
  { key: 'PHONE', slug: 'telefon', label: 'Telefon', shortLabel: 'Telefon', description: 'Kontrollü ve Ekspertiz Raporlu Akıllı Telefonlar' },
  { key: 'PARTS', slug: 'bilgisayar-parcalari', label: 'Bilgisayar Parçaları', shortLabel: 'Bilgisayar Parçaları', description: 'Ekran Kartı, İşlemci, Anakart, RAM ve NVMe SSD Bileşenleri' },
  { key: 'PERIPHERALS', slug: 'cevre-birimleri', label: 'Çevre Birimleri', shortLabel: 'Çevre Birimleri', description: 'Mekanik Klavye, Profesyonel Mouse, Kulaklık ve Ekipmanlar' },
  { key: 'OTHER', slug: 'diger-elektronik', label: 'Diğer Elektronik Ürünler', shortLabel: 'Diğer Elektronik', description: 'Projeksiyon, Akıllı Saat, Ses Sistemleri ve Konsollar' },
];

export const COSMETIC_LABELS: Record<string, string> = {
  A_PLUS: 'A+ (Kusursuz / Sıfır Ayarında)',
  A: 'A (Çok İyi / Kılcal İzler)',
  B: 'B (İyi / Normal Kullanım İzleri)',
  C: 'C (Orta / Belirgin Kozmetik İzler)',
  ANY: 'Farketmez (Teknik Olarak Sorunsuz Olsun)',
};
