import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    if (body.type === 'BUYER') {
      const updated = await prisma.buyerRequest.update({
        where: { id },
        data: {
          status: body.status,
          minBudget: body.minBudget !== undefined ? Number(body.minBudget) : undefined,
          maxBudget: body.maxBudget !== undefined ? Number(body.maxBudget) : undefined,
          brandPref: body.brandPref,
          cpuPref: body.cpuPref,
          ramPref: body.ramPref,
          storagePref: body.storagePref,
          gpuPref: body.gpuPref,
          additionalNotes: body.additionalNotes,
          fullName: body.fullName,
          phone: body.phone,
        },
      });
      return NextResponse.json({ success: true, record: updated });
    }

    if (body.type === 'SELLER') {
      const existing = await prisma.sellerOffer.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Teklif bulunamadı.' }, { status: 404 });
      }

      // Optional: Convert Seller Offer directly into a Store Product!
      if (body.convertToProduct) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const title = `${existing.brand} ${existing.model} ${existing.cpu} ${existing.ram} ${existing.storage}`;
        const slugBase = title
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const newProduct = await prisma.product.create({
          data: {
            slug: `${slugBase}-${randNum}`,
            sku: `G2T-PRD-${randNum}`,
            title,
            description:
              existing.description ||
              'Go2Tek mağazamızda genel kontrolleri yapılmış, temiz ikinci el cihaz.',
            category: existing.category,
            brand: existing.brand,
            model: existing.model,
            cpu: existing.cpu,
            ram: existing.ram,
            ramGb: existing.ramGb,
            storage: existing.storage,
            storageGb: existing.storageGb,
            gpu: existing.gpu,
            screenSize: existing.screenSize,
            cosmeticCondition: existing.cosmeticCondition,
            batteryHealth: existing.batteryHealth,
            images: existing.photos,
            videoUrl: existing.videoUrl || null,
            price: Number(body.salePrice || Math.round(existing.requestedPrice * 1.12)),
            stockStatus: 'IN_STOCK',
            warrantyInfo: 'Mağaza Kontrolü Yapılmış • Mevcut Durumu Belirtilmiştir',
            technicalCheckSummary:
              'Genel çalışma, ekran, klavye ve bağlantı kontrolleri mağazamızda yapılmıştır.',
            isPublished: true,
          },
        });

        await prisma.sellerOffer.update({
          where: { id },
          data: { status: 'PURCHASED' },
        });

        return NextResponse.json({
          success: true,
          convertedProduct: newProduct,
        });
      }

      const updated = await prisma.sellerOffer.update({
        where: { id },
        data: {
          status: body.status,
          requestedPrice:
            body.requestedPrice !== undefined
              ? Number(body.requestedPrice)
              : undefined,
          brand: body.brand,
          model: body.model,
          cpu: body.cpu,
          ram: body.ram,
          storage: body.storage,
          gpu: body.gpu,
          cosmeticCondition: body.cosmeticCondition,
          batteryHealth: body.batteryHealth,
          knownDefects: body.knownDefects,
          description: body.description,
          fullName: body.fullName,
          phone: body.phone,
        },
      });
      return NextResponse.json({ success: true, record: updated });
    }

    return NextResponse.json({ error: 'Geçersiz kayıt tipi.' }, { status: 400 });
  } catch (error) {
    console.error('Request update error:', error);
    return NextResponse.json(
      { error: 'Kayıt güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'BUYER') {
      await prisma.matchTransaction.deleteMany({ where: { buyerRequestId: id } });
      await prisma.buyerRequest.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (type === 'SELLER') {
      await prisma.matchTransaction.deleteMany({ where: { sellerOfferId: id } });
      await prisma.sellerOffer.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Geçersiz tip.' }, { status: 400 });
  } catch (error) {
    console.error('Request delete error:', error);
    return NextResponse.json(
      { error: 'Kayıt silinirken hata oluştu.' },
      { status: 500 }
    );
  }
}
