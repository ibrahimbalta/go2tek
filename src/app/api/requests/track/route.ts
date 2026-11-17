import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeTrackingResponse } from '@/lib/security';
import { checkRateLimit } from '@/lib/rate-limit';

function normalizePhoneDigits(phone: string): string {
  return (phone || '').replace(/\D/g, '').slice(-10);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`track:${ip}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla sorgulama yapıldı. Lütfen biraz bekleyin.' },
        { status: 429 }
      );
    }

    const { referenceNo, phone } = await req.json();
    const cleanRef = String(referenceNo || '').trim().toUpperCase();
    const cleanPhone = normalizePhoneDigits(String(phone || ''));

    if (!cleanRef || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir başvuru numarası ve 10 haneli telefon numaranızı girin.' },
        { status: 400 }
      );
    }

    if (cleanRef.startsWith('G2T-AL-')) {
      const buyerReq = await prisma.buyerRequest.findUnique({
        where: { referenceNo: cleanRef },
        include: {
          transactions: {
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!buyerReq || normalizePhoneDigits(buyerReq.phone) !== cleanPhone) {
        return NextResponse.json(
          { error: 'Başvuru numarası veya telefon numarası eşleşmedi.' },
          { status: 404 }
        );
      }

      const activeTx = buyerReq.transactions[0];
      return NextResponse.json({
        tracking: sanitizeTrackingResponse({
          type: 'BUYER_REQUEST',
          referenceNo: buyerReq.referenceNo,
          category: buyerReq.category,
          status: buyerReq.status,
          currentTransactionStage: activeTx?.currentStage || 'NEW_REQUEST',
          createdAt: buyerReq.createdAt,
        }),
      });
    }

    if (cleanRef.startsWith('G2T-SAT-')) {
      const sellerOff = await prisma.sellerOffer.findUnique({
        where: { referenceNo: cleanRef },
        include: {
          transactions: {
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!sellerOff || normalizePhoneDigits(sellerOff.phone) !== cleanPhone) {
        return NextResponse.json(
          { error: 'Başvuru numarası veya telefon numarası eşleşmedi.' },
          { status: 404 }
        );
      }

      const activeTx = sellerOff.transactions[0];
      return NextResponse.json({
        tracking: sanitizeTrackingResponse({
          type: 'SELLER_OFFER',
          referenceNo: sellerOff.referenceNo,
          category: sellerOff.category,
          status: sellerOff.status,
          currentTransactionStage: activeTx?.currentStage || 'NEW_REQUEST',
          createdAt: sellerOff.createdAt,
        }),
      });
    }

    return NextResponse.json(
      { error: 'Geçersiz başvuru numarası formatı (Örn: G2T-AL-2026-1041 veya G2T-SAT-2026-2081).' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Sorgulama sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
