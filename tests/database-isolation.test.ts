import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/prisma';

describe('Go2Tek Database Schema & Strict Public/Private Isolation', () => {
  it('stores public store products across all 8 categories and never mixes private buyer/seller records', async () => {
    const publishedProducts = await prisma.product.findMany({
      where: { isPublished: true },
    });

    expect(publishedProducts.length).toBeGreaterThanOrEqual(8);
    const categories = new Set(publishedProducts.map((p) => p.category));
    expect(categories.has('NOTEBOOK')).toBe(true);
    expect(categories.has('TABLET')).toBe(true);
    expect(categories.has('DESKTOP')).toBe(true);
    expect(categories.has('MONITOR')).toBe(true);
    expect(categories.has('PHONE')).toBe(true);
    expect(categories.has('PARTS')).toBe(true);
    expect(categories.has('PERIPHERALS')).toBe(true);
    expect(categories.has('OTHER')).toBe(true);

    // Ensure no product contains private request/offer reference codes
    const allProductText = JSON.stringify(publishedProducts);
    expect(allProductText).not.toContain('G2T-AL-');
    expect(allProductText).not.toContain('G2T-SAT-');
  });

  it('maintains private buyer requests, seller offers, 15-stage transactions, 14-point inspections and financial ledgers', async () => {
    const buyerRequests = await prisma.buyerRequest.findMany();
    const sellerOffers = await prisma.sellerOffer.findMany();
    const transactions = await prisma.matchTransaction.findMany({
      include: {
        statusHistory: true,
        inspections: true,
        financials: true,
      },
    });

    expect(buyerRequests.length).toBeGreaterThanOrEqual(4);
    expect(sellerOffers.length).toBeGreaterThanOrEqual(4);
    expect(transactions.length).toBeGreaterThanOrEqual(3);

    const activeTx = transactions.find(
      (t) => t.transactionCode === 'G2T-ISL-2026-9001'
    );
    expect(activeTx).toBeDefined();
    expect(activeTx?.statusHistory.length).toBeGreaterThanOrEqual(5);
    expect(activeTx?.financials).toBeDefined();
    expect(activeTx?.financials?.sellerPurchasePrice).toBe(39500);
    expect(activeTx?.financials?.buyerSalePrice).toBe(45000);
  });
});
