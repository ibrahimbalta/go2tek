import { describe, it, expect } from 'vitest';
import {
  evaluatePaymentAttempt,
  validateDepositVerification,
} from '../src/lib/payment-gateway';
import {
  maskSerialNumber,
  sanitizeTrackingResponse,
  validateUploadedImageFile,
} from '../src/lib/security';

describe('Go2Tek Honest Payment & Deposit Rules', () => {
  it('never marks credit card / gateway payment as successful when gateway API keys are not configured', () => {
    const attempt = evaluatePaymentAttempt({
      paymentMethod: 'PAYMENT_GATEWAY_IYZICO',
      amount: 35000,
      envConfig: {
        iyzicoApiKey: '',
        iyzicoSecretKey: '',
      },
    });

    expect(attempt.success).toBe(false);
    expect(attempt.status).toBe('GATEWAY_NOT_CONFIGURED');
    expect(attempt.userMessage).toContain('Ödeme kuruluşu');
  });

  it('rejects marking deposit as VERIFIED_PAID without a real payment gateway reference or bank receipt code', () => {
    const invalidVerification = validateDepositVerification({
      requestedStatus: 'VERIFIED_PAID',
      verificationRef: '   ',
      depositAmount: 4000,
    });

    expect(invalidVerification.allowed).toBe(false);
    expect(invalidVerification.error).toBeDefined();

    const validVerification = validateDepositVerification({
      requestedStatus: 'VERIFIED_PAID',
      verificationRef: 'TR-DEKONT-2026-99812',
      depositAmount: 4000,
    });

    expect(validVerification.allowed).toBe(true);
  });
});

describe('Go2Tek Privacy, Serial Number Masking & File Upload Security', () => {
  it('masks device serial numbers for non-authorized viewers and shows full serial only to ADMIN or TECHNICAL_STAFF', () => {
    const rawSerial = 'C02X9182JG5H';
    expect(maskSerialNumber(rawSerial, 'PUBLIC')).toBe('C02*******5H');
    expect(maskSerialNumber(rawSerial, 'SALES_STAFF')).toBe('C02*******5H');
    expect(maskSerialNumber(rawSerial, 'ADMIN')).toBe('C02X9182JG5H');
    expect(maskSerialNumber(rawSerial, 'TECHNICAL_STAFF')).toBe('C02X9182JG5H');
  });

  it('ensures public tracking response never leaks seller or buyer personal contact details or serial numbers', () => {
    const sanitized = sanitizeTrackingResponse({
      type: 'BUYER_REQUEST',
      referenceNo: 'G2T-AL-2026-1042',
      category: 'NOTEBOOK',
      status: 'MATCHED',
      currentTransactionStage: 'INSPECTION_IN_PROGRESS',
      createdAt: new Date('2026-11-17T10:00:00Z'),
      // Sensitive fields that might exist in DB objects:
      fullName: 'Ahmet Yılmaz',
      phone: '05321112233',
      matchedSellerName: 'Mehmet Demir',
      matchedSellerPhone: '05449998877',
      matchedSerialNumber: 'SN-SECRET-999',
    });

    expect(sanitized.referenceNo).toBe('G2T-AL-2026-1042');
    expect(sanitized.stageLabel).toBeDefined();
    expect(JSON.stringify(sanitized)).not.toContain('05321112233');
    expect(JSON.stringify(sanitized)).not.toContain('Mehmet Demir');
    expect(JSON.stringify(sanitized)).not.toContain('05449998877');
    expect(JSON.stringify(sanitized)).not.toContain('SN-SECRET-999');
  });

  it('rejects non-image uploads and oversized files', () => {
    const exeFile = validateUploadedImageFile({
      fileName: 'exploit.exe',
      mimeType: 'application/x-msdownload',
      sizeBytes: 10240,
    });
    expect(exeFile.valid).toBe(false);

    const hugeFile = validateUploadedImageFile({
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 8 * 1024 * 1024, // 8MB > 5MB limit
    });
    expect(hugeFile.valid).toBe(false);

    const validWebp = validateUploadedImageFile({
      fileName: 'macbook-front.webp',
      mimeType: 'image/webp',
      sizeBytes: 420 * 1024,
    });
    expect(validWebp.valid).toBe(true);
  });
});
