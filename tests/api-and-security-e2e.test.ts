import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getBuyerRequests, POST as postBuyerRequest } from '../src/app/api/requests/buyer/route';
import { GET as getSellerOffers, POST as postSellerOffer } from '../src/app/api/requests/seller/route';
import { GET as getAdminOverview } from '../src/app/api/admin/overview/route';
import { GET as getStoreProducts } from '../src/app/api/store/products/route';
import { POST as postStoreOrder } from '../src/app/api/store/orders/route';
import { POST as postTrackRequest } from '../src/app/api/requests/track/route';
import { prisma } from '../src/lib/prisma';

describe('Go2Tek API Security, Privacy Isolation & Honest Payment E2E Tests', () => {
  it('blocks unauthenticated access to Buyer Requests, Seller Offers, and Admin Overview (401)', async () => {
    const buyerRes = await getBuyerRequests();
    expect(buyerRes.status).toBe(401);

    const sellerRes = await getSellerOffers();
    expect(sellerRes.status).toBe(401);

    const adminRes = await getAdminOverview();
    expect(adminRes.status).toBe(401);
  });

  it('creates a private Buyer Request with reference number and never exposes it in public store search', async () => {
    const req = new NextRequest('http://localhost:3000/api/requests/buyer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.51',
      },
      body: JSON.stringify({
        category: 'NOTEBOOK',
        brandPref: 'Apple',
        cpuPref: 'M3 Pro',
        ramPref: '18 GB',
        minRamGb: 16,
        storagePref: '512 GB SSD',
        minStorageGb: 512,
        gpuPref: 'Apple GPU',
        screenSizePref: '14"',
        minBudget: 48000,
        maxBudget: 62000,
        cosmeticPref: 'A_PLUS',
        usagePurpose: 'Yazılım Testi',
        additionalNotes: 'Gizli talep testi',
        fullName: 'Test Alıcı',
        phone: '05329991122',
        contactConsent: true,
        kvkkConsent: true,
      }),
    });

    const res = await postBuyerRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.referenceNo).toMatch(/^G2T-AL-2026-\d{4}$/);

    // Verify public store search does NOT contain this buyer request
    const storeReq = new NextRequest(
      `http://localhost:3000/api/store/products?q=${encodeURIComponent(data.referenceNo)}`
    );
    const storeRes = await getStoreProducts(storeReq);
    const storeJson = await storeRes.json();
    expect(storeJson.products).toHaveLength(0);
  });

  it('creates a private Seller Offer and protects serialNumber and phone from public access', async () => {
    const req = new NextRequest('http://localhost:3000/api/requests/seller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.52',
      },
      body: JSON.stringify({
        category: 'TABLET',
        brand: 'Apple',
        model: 'iPad Air M2',
        serialNumber: 'PRIVATE-SN-887766',
        cpu: 'Apple M2',
        ram: '8 GB',
        ramGb: 8,
        storage: '256 GB',
        storageGb: 256,
        gpu: 'Apple GPU',
        screenSize: '11"',
        cosmeticCondition: 'A_PLUS',
        batteryHealth: '%99',
        knownDefects: 'Yok',
        requestedPrice: 21500,
        fullName: 'Test Satıcı',
        phone: '05448883344',
        description: 'Kutulu',
        contactConsent: true,
        kvkkConsent: true,
      }),
    });

    const res = await postSellerOffer(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.referenceNo).toMatch(/^G2T-SAT-2026-\d{4}$/);
    expect(JSON.stringify(data)).not.toContain('PRIVATE-SN-887766');
  });

  it('verifies tracking endpoint requires matching phone and strips all counterparty PII', async () => {
    // Wrong phone must fail with 404
    const wrongPhoneReq = new NextRequest('http://localhost:3000/api/requests/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.53',
      },
      body: JSON.stringify({
        referenceNo: 'G2T-AL-2026-1042',
        phone: '05000000000',
      }),
    });
    const wrongRes = await postTrackRequest(wrongPhoneReq);
    expect(wrongRes.status).toBe(404);

    // Correct phone returns sanitized stage without seller info
    const validReq = new NextRequest('http://localhost:3000/api/requests/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.53',
      },
      body: JSON.stringify({
        referenceNo: 'G2T-AL-2026-1042',
        phone: '05443127760',
      }),
    });
    const validRes = await postTrackRequest(validReq);
    expect(validRes.status).toBe(200);
    const validJson = await validRes.json();
    expect(validJson.tracking.referenceNo).toBe('G2T-AL-2026-1042');
    expect(validJson.tracking.stageKey).toBe('INSPECTION_IN_PROGRESS');
    // Must not leak matched seller Hakan Koç or his phone 05427713099
    expect(JSON.stringify(validJson)).not.toContain('Hakan');
    expect(JSON.stringify(validJson)).not.toContain('05427713099');
  });

  it('refuses to fake gateway payment success when payment gateway credentials are not configured', async () => {
    const firstProduct = await prisma.product.findFirst({
      where: { isPublished: true },
    });
    expect(firstProduct).toBeDefined();

    const orderReq = new NextRequest('http://localhost:3000/api/store/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.54',
      },
      body: JSON.stringify({
        productId: firstProduct!.id,
        customerName: 'Test Müşteri',
        customerPhone: '05321110099',
        customerEmail: 'test@ornek.com',
        shippingAddress: 'Kadıköy / İstanbul',
        paymentMethod: 'PAYMENT_GATEWAY_IYZICO',
      }),
    });

    const orderRes = await postStoreOrder(orderReq);
    expect(orderRes.status).toBe(422);
    const orderJson = await orderRes.json();
    expect(orderJson.success).toBe(false);
    expect(orderJson.paymentStatus).toBe('GATEWAY_NOT_CONFIGURED');
  });
});
