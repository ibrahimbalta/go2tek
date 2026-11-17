import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

// GET: Strictly restricted to authenticated Go2Tek Admin/Staff
export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Alıcı talepleri herkese açık değildir.' },
      { status: 401 }
    );
  }

  const requests = await prisma.buyerRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      transactions: true,
    },
  });

  return NextResponse.json({ requests });
}

// POST: Public customer creates a private buyer request ("Bütçeme Göre Cihaz Bul")
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`buyer-request:${ip}`, 6, 60_000);
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
      brandPref,
      cpuPref,
      ramPref,
      minRamGb,
      storagePref,
      minStorageGb,
      gpuPref,
      screenSizePref,
      minBudget,
      maxBudget,
      cosmeticPref,
      usagePurpose,
      additionalNotes,
      fullName,
      phone,
      contactConsent,
      kvkkConsent,
    } = body;

    if (!category || !fullName || !phone || !maxBudget) {
      return NextResponse.json(
        { error: 'Lütfen kategori, bütçe, ad soyad ve telefon alanlarını eksiksiz doldurun.' },
        { status: 400 }
      );
    }

    if (!contactConsent || !kvkkConsent) {
      return NextResponse.json(
        { error: 'Başvuru oluşturabilmek için iletişim ve KVKK aydınlatma izinlerini onaylamanız gerekmektedir.' },
        { status: 400 }
      );
    }

    const parsedMinBudget = Math.max(0, Number(minBudget) || 0);
    const parsedMaxBudget = Math.max(0, Number(maxBudget) || 0);

    if (parsedMaxBudget <= 0 || parsedMaxBudget < parsedMinBudget) {
      return NextResponse.json(
        { error: 'Maksimum bütçe minimum bütçeden düşük veya sıfır olamaz.' },
        { status: 400 }
      );
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `G2T-AL-2026-${randomCode}`;

    const created = await prisma.buyerRequest.create({
      data: {
        referenceNo,
        category: String(category),
        brandPref: String(brandPref || 'Farketmez').trim(),
        cpuPref: String(cpuPref || 'Farketmez').trim(),
        ramPref: String(ramPref || '16 GB').trim(),
        minRamGb: Number(minRamGb) || parseInt(String(ramPref), 10) || 8,
        storagePref: String(storagePref || '512 GB SSD').trim(),
        minStorageGb: Number(minStorageGb) || parseInt(String(storagePref), 10) || 256,
        gpuPref: String(gpuPref || 'Farketmez').trim(),
        screenSizePref: String(screenSizePref || 'Farketmez').trim(),
        minBudget: parsedMinBudget,
        maxBudget: parsedMaxBudget,
        cosmeticPref: String(cosmeticPref || 'A'),
        usagePurpose: String(usagePurpose || 'Genel Kullanım').trim(),
        additionalNotes: String(additionalNotes || '').trim(),
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        contactConsent: Boolean(contactConsent),
        kvkkConsent: Boolean(kvkkConsent),
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      referenceNo: created.referenceNo,
      message:
        'Özel alıcı talebiniz gizli olarak Go2Tek Yönetim Merkezine iletildi. Talebiniz herkese açık yayınlanmaz; uzman ekibimiz bütçenize uygun cihazı bulduğunda sizinle iletişime geçecektir.',
    });
  } catch (error) {
    console.error('Buyer request error:', error);
    return NextResponse.json(
      { error: 'Talep kaydedilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
