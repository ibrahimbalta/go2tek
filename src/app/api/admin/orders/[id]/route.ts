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

    const existing = await prisma.storeOrder.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
    }

    const nextStatus = body.paymentStatus ?? existing.paymentStatus;
    const nextRef = String(body.gatewayReference ?? existing.gatewayReference ?? '').trim();
    if (nextStatus === 'VERIFIED_PAID' && nextRef.length < 4) {
      return NextResponse.json(
        {
          error:
            'Ödeme kuruluşu veya banka dekont referansı olmadan sipariş "Ödeme Doğrulandı" yapılamaz.',
        },
        { status: 400 }
      );
    }

    const updated = await prisma.storeOrder.update({
      where: { id },
      data: {
        paymentStatus: body.paymentStatus,
        gatewayReference: body.gatewayReference,
        notes: body.notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        userEmail: session.email,
        userRole: session.role,
        action: 'STORE_ORDER_UPDATED',
        entityType: 'StoreOrder',
        entityId: id,
        details: `${updated.orderNo} ödeme durumu: ${updated.paymentStatus}`,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Sipariş güncellenemedi.' },
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
    await prisma.storeOrder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order delete error:', error);
    return NextResponse.json({ error: 'Sipariş silinemedi.' }, { status: 500 });
  }
}
