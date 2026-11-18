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

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: body.title !== undefined ? String(body.title).trim() : existing.title,
        description:
          body.description !== undefined
            ? String(body.description).trim()
            : existing.description,
        category: body.category !== undefined ? String(body.category) : existing.category,
        brand: body.brand !== undefined ? String(body.brand).trim() : existing.brand,
        model: body.model !== undefined ? String(body.model).trim() : existing.model,
        cpu: body.cpu !== undefined ? String(body.cpu).trim() : existing.cpu,
        ram: body.ram !== undefined ? String(body.ram).trim() : existing.ram,
        ramGb:
          body.ramGb !== undefined
            ? Number(body.ramGb)
            : parseInt(String(body.ram || existing.ram), 10) || existing.ramGb,
        storage:
          body.storage !== undefined ? String(body.storage).trim() : existing.storage,
        storageGb:
          body.storageGb !== undefined
            ? Number(body.storageGb)
            : parseInt(String(body.storage || existing.storage), 10) || existing.storageGb,
        gpu: body.gpu !== undefined ? String(body.gpu).trim() : existing.gpu,
        screenSize:
          body.screenSize !== undefined
            ? String(body.screenSize).trim()
            : existing.screenSize,
        cosmeticCondition:
          body.cosmeticCondition !== undefined
            ? String(body.cosmeticCondition)
            : existing.cosmeticCondition,
        batteryHealth:
          body.batteryHealth !== undefined
            ? String(body.batteryHealth).trim()
            : existing.batteryHealth,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        stockStatus:
          body.stockStatus !== undefined
            ? String(body.stockStatus)
            : existing.stockStatus,
        warrantyInfo:
          body.warrantyInfo !== undefined
            ? String(body.warrantyInfo).trim()
            : existing.warrantyInfo,
        technicalCheckSummary:
          body.technicalCheckSummary !== undefined
            ? String(body.technicalCheckSummary).trim()
            : existing.technicalCheckSummary,
        images:
          body.imageUrl !== undefined
            ? JSON.stringify([String(body.imageUrl).trim()])
            : body.images !== undefined
            ? typeof body.images === 'string'
              ? body.images
              : JSON.stringify(body.images)
            : existing.images,
        videoUrl:
          body.videoUrl !== undefined
            ? body.videoUrl
              ? String(body.videoUrl).trim()
              : null
            : existing.videoUrl,
        shopierUrl:
          body.shopierUrl !== undefined
            ? body.shopierUrl
              ? String(body.shopierUrl).trim()
              : null
            : existing.shopierUrl,
        sahibindenUrl:
          body.sahibindenUrl !== undefined
            ? body.sahibindenUrl
              ? String(body.sahibindenUrl).trim()
              : null
            : existing.sahibindenUrl,
        isPublished:
          body.isPublished !== undefined
            ? Boolean(body.isPublished)
            : existing.isPublished,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        userEmail: session.email,
        userRole: session.role,
        action: 'STORE_PRODUCT_UPDATED',
        entityType: 'Product',
        entityId: id,
        details: `${updated.sku} - ${updated.title} (${updated.price.toLocaleString('tr-TR')} TL) güncellendi.`,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: 'Ürün güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { id } = await context.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
    }

    await prisma.storeOrder.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        userEmail: session.email,
        userRole: session.role,
        action: 'STORE_PRODUCT_DELETED',
        entityType: 'Product',
        entityId: id,
        details: `${existing.sku} - ${existing.title} mağaza stoğundan silindi.`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { error: 'Ürün silinirken hata oluştu.' },
      { status: 500 }
    );
  }
}
