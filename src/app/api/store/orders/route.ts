import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { evaluatePaymentAttempt } from '@/lib/payment-gateway';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`store-order:${ip}`, 8, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      productId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod,
      notes,
    } = body;

    const isInStorePickup = paymentMethod === 'IN_STORE_RESERVE';

    if (!productId || !customerName || !customerPhone || (!isInStorePickup && !shippingAddress)) {
      return NextResponse.json(
        { error: 'Lütfen ad soyad, telefon ve teslimat bilgilerinizi eksiksiz doldurun.' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isPublished || product.stockStatus === 'SOLD') {
      return NextResponse.json(
        { error: 'Seçilen ürün stokta bulunamadı veya satılmış.' },
        { status: 404 }
      );
    }

    const chosenMethod =
      paymentMethod === 'PAYMENT_GATEWAY_IYZICO'
        ? 'PAYMENT_GATEWAY_IYZICO'
        : isInStorePickup
        ? 'IN_STORE_RESERVE'
        : 'BANK_TRANSFER_EFT';

    const paymentEval = evaluatePaymentAttempt({
      paymentMethod: chosenMethod === 'PAYMENT_GATEWAY_IYZICO' ? 'PAYMENT_GATEWAY_IYZICO' : 'BANK_TRANSFER_EFT',
      amount: product.price,
    });

    // If user tries credit card payment while gateway API keys are not configured,
    // return an honest response and do NOT claim payment succeeded.
    if (paymentEval.status === 'GATEWAY_NOT_CONFIGURED') {
      return NextResponse.json(
        {
          success: false,
          paymentStatus: 'GATEWAY_NOT_CONFIGURED',
          message: paymentEval.userMessage,
        },
        { status: 422 }
      );
    }

    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNo = `G2T-SIP-2026-${randSuffix}`;

    const order = await prisma.storeOrder.create({
      data: {
        orderNo,
        productId: product.id,
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        customerEmail: String(customerEmail || '').trim(),
        shippingAddress: isInStorePickup
          ? String(shippingAddress || 'Mağazadan Elden Teslim').trim()
          : String(shippingAddress).trim(),
        amount: product.price,
        paymentMethod: chosenMethod,
        paymentStatus: paymentEval.status,
        notes: String(notes || '').trim(),
      },
    });

    return NextResponse.json({
      success: true,
      orderNo: order.orderNo,
      paymentStatus: order.paymentStatus,
      message: isInStorePickup
        ? `Rezervasyon talebiniz alındı (${order.orderNo}). Mağazamızdan elden teslim için ekibimiz sizinle iletişime geçecektir.`
        : paymentEval.userMessage,
    });
  } catch (error) {
    console.error('Store order creation error:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
