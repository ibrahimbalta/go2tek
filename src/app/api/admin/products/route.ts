import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      category,
      brand,
      model,
      cpu,
      ram,
      ramGb,
      storage,
      storageGb,
      gpu,
      screenSize,
      cosmeticCondition,
      batteryHealth,
      price,
      warrantyInfo,
      technicalCheckSummary,
      description,
      imageUrl,
      videoUrl,
      shopierUrl,
      sahibindenUrl,
      stockStatus,
      isPublished,
    } = body;

    if (!title || !category || !brand || !price) {
      return NextResponse.json(
        { error: 'Ürün adı, kategori, marka ve satış fiyatı zorunludur.' },
        { status: 400 }
      );
    }

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const slugBase = String(title)
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const product = await prisma.product.create({
      data: {
        slug: `${slugBase}-${randNum}`,
        sku: `G2T-PRD-${randNum}`,
        title: String(title).trim(),
        description: String(
          description ||
            'Go2Tek 14 Noktalı Teknik Kontrol Merkezinden onaylı garantili ikinci el teknoloji ürünü.'
        ).trim(),
        category: String(category),
        brand: String(brand).trim(),
        model: String(model || brand).trim(),
        cpu: String(cpu || '-').trim(),
        ram: String(ram || '16 GB').trim(),
        ramGb: Number(ramGb) || 16,
        storage: String(storage || '512 GB SSD').trim(),
        storageGb: Number(storageGb) || 512,
        gpu: String(gpu || 'Dahili').trim(),
        screenSize: String(screenSize || '15.6"').trim(),
        cosmeticCondition: String(cosmeticCondition || 'A_PLUS'),
        batteryHealth: String(batteryHealth || '%95').trim(),
        images: JSON.stringify([
          imageUrl || '/images/products/macbook-pro-14.svg',
        ]),
        videoUrl: videoUrl ? String(videoUrl).trim() : null,
        shopierUrl: shopierUrl ? String(shopierUrl).trim() : null,
        sahibindenUrl: sahibindenUrl ? String(sahibindenUrl).trim() : null,
        price: Number(price),
        stockStatus: String(stockStatus || 'IN_STOCK'),
        warrantyInfo: String(
          warrantyInfo || '6 Ay Go2Tek Kurumsal Donanım Garantisi'
        ).trim(),
        technicalCheckSummary: String(
          technicalCheckSummary ||
            '14 noktalı donanım ve kozmetik kontrolleri başarıyla tamamlandı.'
        ).trim(),
        isPublished: isPublished === undefined ? true : Boolean(isPublished),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        userEmail: session.email,
        userRole: session.role,
        action: 'STORE_PRODUCT_CREATED',
        entityType: 'Product',
        entityId: product.id,
        details: `${product.sku} - ${product.title} mağaza stoğuna eklendi.`,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Ürün eklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}
