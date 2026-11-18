import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { maskSerialNumber } from '@/lib/security';

// GET: Strictly restricted to authenticated Go2Tek Admin/Staff
export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Satıcı teklifleri herkese açık değildir.' },
      { status: 401 }
    );
  }

  const offers = await prisma.sellerOffer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      transactions: true,
    },
  });

  const maskedOffers = offers.map((offer) => ({
    ...offer,
    serialNumber: maskSerialNumber(offer.serialNumber, session.role),
  }));

  return NextResponse.json({ offers: maskedOffers });
}

// POST: Public customer creates a private seller offer ("Cihazımı Satmak İstiyorum")
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`seller-offer:${ip}`, 6, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla başvuru denemesi yapıldı. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check
    if (body.websiteUrl) {
      return NextResponse.json({ error: 'Spam algılandı.' }, { status: 400 });
    }

    const {
      category,
      brand,
      model,
      serialNumber,
      cpu,
      ram,
      ramGb,
      storage,
      storageGb,
      gpu,
      screenSize,
      cosmeticCondition,
      batteryHealth,
      knownDefects,
      photos,
      videoUrl,
      requestedPrice,
      fullName,
      phone,
      description,
      contactConsent,
      kvkkConsent,
    } = body;

    if (!category || !brand || !model || !requestedPrice || !fullName || !phone) {
      return NextResponse.json(
        {
          error:
            'Lütfen kategori, marka, model, istenen satış fiyatı, ad soyad ve telefon alanlarını doldurun.',
        },
        { status: 400 }
      );
    }

    if (!contactConsent || !kvkkConsent) {
      return NextResponse.json(
        {
          error:
            'Satıcı teklifi oluşturabilmek için iletişim ve kişisel veri işleme (KVKK) izinlerini onaylamanız gerekmektedir.',
        },
        { status: 400 }
      );
    }

    const parsedPrice = Number(requestedPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir satış fiyatı girin.' },
        { status: 400 }
      );
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `G2T-SAT-2026-${randomCode}`;

    const photoList = Array.isArray(photos) && photos.length > 0
      ? photos
      : ['/images/products/macbook-pro-14.svg'];

    const created = await prisma.sellerOffer.create({
      data: {
        referenceNo,
        category: String(category),
        brand: String(brand).trim(),
        model: String(model).trim(),
        serialNumber: String(serialNumber || 'Belirtilmedi').trim(),
        cpu: String(cpu || 'Belirtilmedi').trim(),
        ram: String(ram || '16 GB').trim(),
        ramGb: Number(ramGb) || parseInt(String(ram), 10) || 8,
        storage: String(storage || '512 GB SSD').trim(),
        storageGb: Number(storageGb) || parseInt(String(storage), 10) || 256,
        gpu: String(gpu || 'Dahili').trim(),
        screenSize: String(screenSize || '15.6"').trim(),
        cosmeticCondition: String(cosmeticCondition || 'A'),
        batteryHealth: String(batteryHealth || '%90+').trim(),
        knownDefects: String(knownDefects || 'Bilinen arıza yok').trim(),
        photos: JSON.stringify(photoList),
        videoUrl: videoUrl ? String(videoUrl).trim() : null,
        requestedPrice: parsedPrice,
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        description: String(description || '').trim(),
        contactConsent: Boolean(contactConsent),
        kvkkConsent: Boolean(kvkkConsent),
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      referenceNo: created.referenceNo,
      message:
        'Özel satıcı teklifiniz gizli olarak Go2Tek Yönetim Merkezine kaydedildi. Cihazınız herkese açık ilan olarak yayınlanmaz; yalnızca Go2Tek uzmanları tarafından değerlendirilir.',
    });
  } catch (error) {
    console.error('Seller offer error:', error);
    return NextResponse.json(
      { error: 'Satıcı teklifi kaydedilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
