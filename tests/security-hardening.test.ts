import { describe, it, expect } from 'vitest';
import {
  evaluatePaymentAttempt,
  validateDepositVerification,
} from '../src/lib/payment-gateway';
import {
  maskSerialNumber,
  sanitizeTrackingResponse,
  validateUploadedImageFile,
  validateMediaMagicBytes,
  sanitizeSafeUrl,
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
      sizeBytes: 8 * 1024 * 1024,
    });
    expect(hugeFile.valid).toBe(false);

    const validWebp = validateUploadedImageFile({
      fileName: 'macbook-front.webp',
      mimeType: 'image/webp',
      sizeBytes: 420 * 1024,
    });
    expect(validWebp.valid).toBe(true);
  });

  it('rejects spoofed files whose binary magic bytes do not match image/video signatures', () => {
    const fakeJpg = Buffer.from('PLAIN_TEXT_SPOOFED_IMAGE_BYTES', 'utf8');
    expect(validateMediaMagicBytes(fakeJpg, false)).toBe(false);

    const realPng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    expect(validateMediaMagicBytes(realPng, false)).toBe(true);

    const realMp4 = Buffer.from([
      0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32,
    ]);
    expect(validateMediaMagicBytes(realMp4, true)).toBe(true);
  });

  it('blocks javascript: and data: XSS URLs while allowing safe https and relative URLs', () => {
    expect(sanitizeSafeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeSafeUrl('data:text/html,xss')).toBeNull();
    expect(sanitizeSafeUrl('//evil.com/phish')).toBeNull();
    expect(sanitizeSafeUrl('https://www.shopier.com/go2tek/123', false)).toBe(
      'https://www.shopier.com/go2tek/123'
    );
    expect(sanitizeSafeUrl('/magaza/notebook')).toBe('/magaza/notebook');
  });
});
