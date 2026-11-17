import { describe, it, expect } from 'vitest';
import {
  TRANSACTION_STAGES,
  INSPECTION_CRITERIA,
  PRODUCT_CATEGORIES,
} from '../src/lib/constants';
import { calculateMatchScore } from '../src/lib/matching-engine';
import { calculateFinancialSummary } from '../src/lib/finance-calculator';

describe('Go2Tek Core Constants (15 Transaction Stages, 14 Inspection Criteria, 8 Categories)', () => {
  it('defines all 15 required transaction stages in order', () => {
    expect(TRANSACTION_STAGES).toHaveLength(15);
    const stageKeys = TRANSACTION_STAGES.map((s) => s.key);
    expect(stageKeys).toEqual([
      'NEW_REQUEST',
      'MATCH_PROPOSED',
      'BUYER_CONTACTED',
      'BUYER_ACCEPTED',
      'DEPOSIT_PENDING',
      'DEPOSIT_RECEIVED',
      'SELLER_AGREED',
      'DEVICE_RECEIVED',
      'INSPECTION_IN_PROGRESS',
      'INSPECTION_PASSED',
      'READY_FOR_SALE',
      'DELIVERED_TO_BUYER',
      'COMPLETED',
      'CANCELLED',
      'RETURN_DISPUTE',
    ]);
  });

  it('defines all 14 required technical inspection criteria', () => {
    expect(INSPECTION_CRITERIA).toHaveLength(14);
    const fields = INSPECTION_CRITERIA.map((c) => c.field);
    expect(fields).toEqual([
      'screenTest',
      'keyboardTest',
      'touchpadTest',
      'usbPortsTest',
      'wifiTest',
      'cameraTest',
      'speakerTest',
      'microphoneTest',
      'storageHealthTest',
      'ramTest',
      'cpuThermalTest',
      'batteryHealthTest',
      'chargerAdapterTest',
      'cosmeticCheck',
    ]);
  });

  it('defines all 8 required store product categories', () => {
    expect(PRODUCT_CATEGORIES).toHaveLength(8);
  });
});

describe('Go2Tek Matching Engine (Karar Destek Sistemi)', () => {
  const sampleBuyerRequest = {
    category: 'NOTEBOOK',
    brandPref: 'Apple',
    cpuPref: 'M2',
    ramPref: '16 GB',
    minRamGb: 16,
    storagePref: '512 GB SSD',
    minStorageGb: 512,
    gpuPref: 'Dahili Apple GPU',
    screenSizePref: '13.6"',
    minBudget: 32000,
    maxBudget: 42000,
    cosmeticPref: 'A',
  };

  it('scores high (>= 85) when seller offer matches budget, brand, CPU, RAM, storage, GPU and cosmetic condition', () => {
    const matchingSellerOffer = {
      category: 'NOTEBOOK',
      brand: 'Apple',
      model: 'MacBook Air M2',
      cpu: 'Apple M2 8-Core',
      ram: '16 GB',
      ramGb: 16,
      storage: '512 GB NVMe SSD',
      storageGb: 512,
      gpu: 'Apple 10-Core GPU',
      screenSize: '13.6"',
      cosmeticCondition: 'A_PLUS',
      requestedPrice: 34500,
    };

    const result = calculateMatchScore(sampleBuyerRequest, matchingSellerOffer);
    expect(result.isCompatibleCategory).toBe(true);
    expect(result.totalScore).toBeGreaterThanOrEqual(85);
    expect(result.suggestedBuyerSalePrice).toBeGreaterThan(matchingSellerOffer.requestedPrice);
    expect(result.criteriaBreakdown.budgetMatch).toBeGreaterThan(25);
  });

  it('returns 0 score when categories do not match', () => {
    const tabletOffer = {
      category: 'TABLET',
      brand: 'Apple',
      model: 'iPad Pro M2',
      cpu: 'Apple M2',
      ram: '16 GB',
      ramGb: 16,
      storage: '512 GB',
      storageGb: 512,
      gpu: 'Apple GPU',
      screenSize: '12.9"',
      cosmeticCondition: 'A_PLUS',
      requestedPrice: 34000,
    };

    const result = calculateMatchScore(sampleBuyerRequest, tabletOffer);
    expect(result.isCompatibleCategory).toBe(false);
    expect(result.totalScore).toBe(0);
  });

  it('lowers budget score when seller requested price significantly exceeds buyer max budget', () => {
    const expensiveSellerOffer = {
      category: 'NOTEBOOK',
      brand: 'Apple',
      model: 'MacBook Pro M3 Max',
      cpu: 'Apple M3 Max',
      ram: '32 GB',
      ramGb: 32,
      storage: '1 TB SSD',
      storageGb: 1024,
      gpu: 'Apple 30-Core GPU',
      screenSize: '14.2"',
      cosmeticCondition: 'A_PLUS',
      requestedPrice: 75000,
    };

    const result = calculateMatchScore(sampleBuyerRequest, expensiveSellerOffer);
    expect(result.criteriaBreakdown.budgetMatch).toBe(0);
  });
});

describe('Go2Tek Financial Ledger Calculator', () => {
  it('accurately computes remaining payment, estimated gross/net profit, and actual gross/net profit', () => {
    const summary = calculateFinancialSummary({
      sellerPurchasePrice: 30000,
      buyerSalePrice: 36500,
      depositAmount: 5000,
      depositStatus: 'VERIFIED_PAID',
      remainingPaymentStatus: 'NOT_PAID',
      shippingCost: 450,
      inspectionCost: 350,
      repairCost: 700,
      taxAndOtherCosts: 1000,
      isCompleted: false,
    });

    // Gross profit = 36500 - 30000 = 6500
    expect(summary.estimatedGrossProfit).toBe(6500);
    // Total expenses = 450 + 350 + 700 + 1000 = 2500
    // Net profit = 6500 - 2500 = 4000
    expect(summary.estimatedNetProfit).toBe(4000);
    // Remaining payment = 36500 - 5000 (verified deposit) = 31500
    expect(summary.remainingAmount).toBe(31500);
    // Since transaction is not completed yet, actual profit is 0 until realized
    expect(summary.actualGrossProfit).toBe(0);
    expect(summary.actualNetProfit).toBe(0);
  });

  it('does not deduct deposit from remaining payment if depositStatus is NOT VERIFIED_PAID', () => {
    const summary = calculateFinancialSummary({
      sellerPurchasePrice: 20000,
      buyerSalePrice: 25000,
      depositAmount: 3000,
      depositStatus: 'AWAITING_VERIFICATION',
      remainingPaymentStatus: 'NOT_PAID',
      shippingCost: 300,
      inspectionCost: 200,
      repairCost: 0,
      taxAndOtherCosts: 500,
      isCompleted: false,
    });

    // Unverified deposit must not reduce remaining payment prematurely
    expect(summary.remainingAmount).toBe(25000);
  });
});
