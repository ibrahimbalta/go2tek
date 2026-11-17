import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';
import { calculateMatchScore } from '@/lib/matching-engine';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { buyerRequestId, sellerOfferId, adminNotes } = await req.json();
    if (!buyerRequestId || !sellerOfferId) {
      return NextResponse.json(
        { error: 'Alıcı talebi ve satıcı teklifi seçilmelidir.' },
        { status: 400 }
      );
    }

    const [buyerReq, sellerOff] = await Promise.all([
      prisma.buyerRequest.findUnique({ where: { id: buyerRequestId } }),
      prisma.sellerOffer.findUnique({ where: { id: sellerOfferId } }),
    ]);

    if (!buyerReq || !sellerOff) {
      return NextResponse.json(
        { error: 'Alıcı talebi veya satıcı teklifi bulunamadı.' },
        { status: 404 }
      );
    }

    const evaluation = calculateMatchScore(buyerReq, sellerOff);
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const transactionCode = `G2T-ISL-2026-${randCode}`;

    const suggestedSalePrice = Math.min(
      buyerReq.maxBudget,
      evaluation.suggestedBuyerSalePrice || Math.round(sellerOff.requestedPrice * 1.1)
    );

    const tx = await prisma.matchTransaction.create({
      data: {
        transactionCode,
        buyerRequestId: buyerReq.id,
        sellerOfferId: sellerOff.id,
        matchScore: evaluation.totalScore,
        matchAnalysisJson: JSON.stringify({
          ...evaluation.criteriaBreakdown,
          notes: evaluation.notes,
        }),
        currentStage: 'MATCH_PROPOSED',
        assignedUserId: session.userId,
        assignedUserName: session.name,
        adminNotes: String(
          adminNotes ||
            'Eşleştirme merkezinden yönetici kararıyla süreç başlatıldı.'
        ),
      },
    });

    await prisma.transactionStatusHistory.create({
      data: {
        transactionId: tx.id,
        fromStage: 'NEW_REQUEST',
        toStage: 'MATCH_PROPOSED',
        changedByUserId: session.userId,
        changedByName: session.name,
        note: `Yönetici (${session.name}) tarafından %${evaluation.totalScore} uyum skoru ile eşleştirme oluşturuldu.`,
      },
    });

    const estGross = suggestedSalePrice - sellerOff.requestedPrice;
    const estExpenses = 750; // Varsayılan tahmini kargo + kontrol gideri
    await prisma.financialLedger.create({
      data: {
        transactionId: tx.id,
        sellerPurchasePrice: sellerOff.requestedPrice,
        buyerSalePrice: suggestedSalePrice,
        depositAmount: Math.round(suggestedSalePrice * 0.1),
        depositStatus: 'NOT_PAID',
        depositVerificationRef: '',
        remainingAmount: suggestedSalePrice,
        remainingPaymentStatus: 'NOT_PAID',
        shippingCost: 400,
        inspectionCost: 350,
        repairCost: 0,
        taxAndOtherCosts: 0,
        estimatedGrossProfit: estGross,
        estimatedNetProfit: estGross - estExpenses,
        actualGrossProfit: 0,
        actualNetProfit: 0,
      },
    });

    await Promise.all([
      prisma.buyerRequest.update({
        where: { id: buyerReq.id },
        data: { status: 'MATCHED' },
      }),
      prisma.sellerOffer.update({
        where: { id: sellerOff.id },
        data: { status: 'MATCHED' },
      }),
      prisma.auditLog.create({
        data: {
          userId: session.userId,
          userEmail: session.email,
          userRole: session.role,
          action: 'MATCH_CREATED',
          entityType: 'MatchTransaction',
          entityId: tx.id,
          details: `${buyerReq.referenceNo} ile ${sellerOff.referenceNo} eşleştirildi (${tx.transactionCode}).`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      transaction: tx,
    });
  } catch (error) {
    console.error('Match creation error:', error);
    return NextResponse.json(
      { error: 'Eşleştirme oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
