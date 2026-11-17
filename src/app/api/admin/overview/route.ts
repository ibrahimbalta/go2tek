import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';
import { calculateMatchScore } from '@/lib/matching-engine';
import { maskSerialNumber } from '@/lib/security';
import { getHeroSlides, getSiteSettings } from '@/lib/site-config';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Lütfen yönetici/personel girişi yapın.' },
      { status: 401 }
    );
  }

  const [
    buyerRequests,
    sellerOffersRaw,
    transactions,
    inspections,
    products,
    storeOrders,
    auditLogs,
    users,
    siteSettings,
    heroSlides,
  ] = await Promise.all([
    prisma.buyerRequest.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sellerOffer.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.matchTransaction.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        buyerRequest: true,
        sellerOffer: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        inspections: {
          orderBy: { inspectedAt: 'desc' },
        },
        financials: true,
      },
    }),
    prisma.technicalInspection.findMany({
      orderBy: { inspectedAt: 'desc' },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.storeOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 40,
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    getSiteSettings(),
    getHeroSlides(),
  ]);

  const sellerOffers = sellerOffersRaw.map((offer) => ({
    ...offer,
    serialNumber: maskSerialNumber(offer.serialNumber, session.role),
    rawSerialNumber:
      session.role === 'ADMIN' || session.role === 'TECHNICAL_STAFF'
        ? offer.serialNumber
        : undefined,
  }));

  const matchSuggestions: Array<{
    buyerRequest: (typeof buyerRequests)[number];
    sellerOffer: (typeof sellerOffers)[number];
    evaluation: ReturnType<typeof calculateMatchScore>;
    alreadyMatched: boolean;
  }> = [];

  for (const br of buyerRequests) {
    if (br.status === 'CANCELLED') continue;
    for (const so of sellerOffers) {
      if (so.status === 'CANCELLED' || so.status === 'REJECTED') continue;
      const evaluation = calculateMatchScore(br, so);
      if (evaluation.isCompatibleCategory && evaluation.totalScore >= 55) {
        const alreadyMatched = transactions.some(
          (tx) => tx.buyerRequestId === br.id && tx.sellerOfferId === so.id
        );
        matchSuggestions.push({
          buyerRequest: br,
          sellerOffer: so,
          evaluation,
          alreadyMatched,
        });
      }
    }
  }

  matchSuggestions.sort(
    (a, b) => b.evaluation.totalScore - a.evaluation.totalScore
  );

  const pendingMatchesCount = transactions.filter(
    (t) =>
      t.currentStage === 'NEW_REQUEST' || t.currentStage === 'MATCH_PROPOSED'
  ).length;

  const activeTransactionsCount = transactions.filter(
    (t) => t.currentStage !== 'COMPLETED' && t.currentStage !== 'CANCELLED'
  ).length;

  const completedTransactionsCount = transactions.filter(
    (t) => t.currentStage === 'COMPLETED'
  ).length;

  return NextResponse.json({
    session,
    stats: {
      totalBuyerRequests: buyerRequests.length,
      totalSellerOffers: sellerOffers.length,
      pendingMatches: pendingMatchesCount,
      activeTransactions: activeTransactionsCount,
      completedTransactions: completedTransactionsCount,
      storeSalesCount: storeOrders.length,
      storeProductsCount: products.length,
    },
    buyerRequests,
    sellerOffers,
    matchSuggestions,
    transactions,
    inspections,
    products,
    storeOrders,
    auditLogs,
    users,
    siteSettings,
    heroSlides,
  });
}
