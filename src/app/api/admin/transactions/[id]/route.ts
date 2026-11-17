import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';
import { TRANSACTION_STAGES } from '@/lib/constants';
import { calculateFinancialSummary } from '@/lib/finance-calculator';
import { validateDepositVerification } from '@/lib/payment-gateway';

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

    const existingTx = await prisma.matchTransaction.findUnique({
      where: { id },
      include: { financials: true },
    });

    if (!existingTx) {
      return NextResponse.json(
        { error: 'İşlem kaydı bulunamadı.' },
        { status: 404 }
      );
    }

    // 1. Handle Stage Update (if requested)
    if (body.newStage && body.newStage !== existingTx.currentStage) {
      const validStage = TRANSACTION_STAGES.find((s) => s.key === body.newStage);
      if (!validStage) {
        return NextResponse.json(
          { error: 'Geçersiz işlem durumu.' },
          { status: 400 }
        );
      }

      // Honest payment check when moving to DEPOSIT_RECEIVED (Stage 6)
      if (body.newStage === 'DEPOSIT_RECEIVED') {
        const currentDepositStatus =
          body.financials?.depositStatus ??
          existingTx.financials?.depositStatus ??
          'NOT_PAID';
        const currentDepositRef =
          body.financials?.depositVerificationRef ??
          existingTx.financials?.depositVerificationRef ??
          '';

        if (currentDepositStatus !== 'VERIFIED_PAID' || !currentDepositRef.trim()) {
          return NextResponse.json(
            {
              error:
                'Gerçek ödeme/dekont doğrulaması ("VERIFIED_PAID" ve Ödeme/Dekont Referans No) girilmeden işlem durumu "Kapora alındı" olarak işaretlenemez.',
            },
            { status: 400 }
          );
        }
      }

      await prisma.matchTransaction.update({
        where: { id },
        data: {
          currentStage: body.newStage,
          adminNotes:
            body.adminNotes !== undefined
              ? String(body.adminNotes)
              : existingTx.adminNotes,
        },
      });

      await prisma.transactionStatusHistory.create({
        data: {
          transactionId: id,
          fromStage: existingTx.currentStage,
          toStage: body.newStage,
          changedByUserId: session.userId,
          changedByName: session.name,
          note: String(
            body.stageNote || `Durum "${validStage.label}" olarak güncellendi.`
          ),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          userEmail: session.email,
          userRole: session.role,
          action: 'TRANSACTION_STAGE_CHANGED',
          entityType: 'MatchTransaction',
          entityId: id,
          details: `${existingTx.transactionCode}: ${existingTx.currentStage} -> ${body.newStage}`,
        },
      });
    } else if (body.adminNotes !== undefined) {
      await prisma.matchTransaction.update({
        where: { id },
        data: { adminNotes: String(body.adminNotes) },
      });
    }

    // 2. Handle Financial Ledger Update (if requested)
    if (body.financials) {
      const f = body.financials;
      const depositCheck = validateDepositVerification({
        requestedStatus: String(f.depositStatus || 'NOT_PAID'),
        verificationRef: String(f.depositVerificationRef || ''),
        depositAmount: Number(f.depositAmount || 0),
      });

      if (!depositCheck.allowed) {
        return NextResponse.json(
          { error: depositCheck.error },
          { status: 400 }
        );
      }

      const targetStage = body.newStage || existingTx.currentStage;
      const computed = calculateFinancialSummary({
        sellerPurchasePrice: Number(f.sellerPurchasePrice || 0),
        buyerSalePrice: Number(f.buyerSalePrice || 0),
        depositAmount: Number(f.depositAmount || 0),
        depositStatus: String(f.depositStatus || 'NOT_PAID'),
        remainingPaymentStatus: String(f.remainingPaymentStatus || 'NOT_PAID'),
        shippingCost: Number(f.shippingCost || 0),
        inspectionCost: Number(f.inspectionCost || 0),
        repairCost: Number(f.repairCost || 0),
        taxAndOtherCosts: Number(f.taxAndOtherCosts || 0),
        isCompleted: targetStage === 'COMPLETED',
      });

      await prisma.financialLedger.upsert({
        where: { transactionId: id },
        create: {
          transactionId: id,
          sellerPurchasePrice: Number(f.sellerPurchasePrice || 0),
          buyerSalePrice: Number(f.buyerSalePrice || 0),
          depositAmount: Number(f.depositAmount || 0),
          depositStatus: String(f.depositStatus || 'NOT_PAID'),
          depositVerificationRef: String(f.depositVerificationRef || '').trim(),
          remainingAmount: computed.remainingAmount,
          remainingPaymentStatus: String(f.remainingPaymentStatus || 'NOT_PAID'),
          shippingCost: Number(f.shippingCost || 0),
          inspectionCost: Number(f.inspectionCost || 0),
          repairCost: Number(f.repairCost || 0),
          taxAndOtherCosts: Number(f.taxAndOtherCosts || 0),
          estimatedGrossProfit: computed.estimatedGrossProfit,
          estimatedNetProfit: computed.estimatedNetProfit,
          actualGrossProfit: computed.actualGrossProfit,
          actualNetProfit: computed.actualNetProfit,
        },
        update: {
          sellerPurchasePrice: Number(f.sellerPurchasePrice || 0),
          buyerSalePrice: Number(f.buyerSalePrice || 0),
          depositAmount: Number(f.depositAmount || 0),
          depositStatus: String(f.depositStatus || 'NOT_PAID'),
          depositVerificationRef: String(f.depositVerificationRef || '').trim(),
          remainingAmount: computed.remainingAmount,
          remainingPaymentStatus: String(f.remainingPaymentStatus || 'NOT_PAID'),
          shippingCost: Number(f.shippingCost || 0),
          inspectionCost: Number(f.inspectionCost || 0),
          repairCost: Number(f.repairCost || 0),
          taxAndOtherCosts: Number(f.taxAndOtherCosts || 0),
          estimatedGrossProfit: computed.estimatedGrossProfit,
          estimatedNetProfit: computed.estimatedNetProfit,
          actualGrossProfit: computed.actualGrossProfit,
          actualNetProfit: computed.actualNetProfit,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          userEmail: session.email,
          userRole: session.role,
          action: 'FINANCIAL_LEDGER_UPDATED',
          entityType: 'FinancialLedger',
          entityId: id,
          details: `${existingTx.transactionCode} finans kayıtları güncellendi. Tahmini Net Kâr: ${computed.estimatedNetProfit} TL`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Transaction update error:', error);
    return NextResponse.json(
      { error: 'İşlem güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
