import { TRANSACTION_STAGES } from './constants';

export function maskSerialNumber(
  serialNumber: string,
  viewerRole: string = 'PUBLIC'
): string {
  const clean = (serialNumber || '').trim();
  if (!clean) return 'Belirtilmedi';
  if (viewerRole === 'ADMIN' || viewerRole === 'TECHNICAL_STAFF') {
    return clean;
  }
  if (clean.length <= 5) {
    return '***';
  }
  const prefix = clean.slice(0, 3);
  const suffix = clean.slice(-2);
  const maskedMiddle = '*'.repeat(Math.max(4, clean.length - 5));
  return `${prefix}${maskedMiddle}${suffix}`;
}

export interface RawTrackingRecord {
  type: 'BUYER_REQUEST' | 'SELLER_OFFER';
  referenceNo: string;
  category: string;
  status: string;
  currentTransactionStage?: string | null;
  createdAt: Date | string;
  // Sensitive fields that MUST NEVER be returned:
  fullName?: string;
  phone?: string;
  serialNumber?: string;
  matchedSellerName?: string;
  matchedSellerPhone?: string;
  matchedBuyerName?: string;
  matchedBuyerPhone?: string;
  matchedSerialNumber?: string;
}

export interface SanitizedTrackingView {
  type: 'BUYER_REQUEST' | 'SELLER_OFFER';
  referenceNo: string;
  category: string;
  status: string;
  stageKey: string;
  stageStep: number;
  stageLabel: string;
  stageDescription: string;
  submittedAt: string;
}

export function sanitizeTrackingResponse(
  record: RawTrackingRecord
): SanitizedTrackingView {
  const stageKey = record.currentTransactionStage || 'NEW_REQUEST';
  const stageMeta =
    TRANSACTION_STAGES.find((s) => s.key === stageKey) || TRANSACTION_STAGES[0];

  return {
    type: record.type,
    referenceNo: record.referenceNo,
    category: record.category,
    status: record.status,
    stageKey: stageMeta.key,
    stageStep: stageMeta.step,
    stageLabel: stageMeta.label,
    stageDescription: stageMeta.description,
    submittedAt:
      record.createdAt instanceof Date
        ? record.createdAt.toISOString()
        : String(record.createdAt),
  };
}

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateUploadedImageFile(file: {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}): { valid: boolean; error?: string } {
  if (!file.fileName || !file.mimeType) {
    return { valid: false, error: 'Dosya adı veya türü eksik.' };
  }

  const lowerName = file.fileName.toLowerCase();
  const dotIndex = lowerName.lastIndexOf('.');
  const ext = dotIndex >= 0 ? lowerName.slice(dotIndex) : '';

  if (
    !ALLOWED_IMAGE_MIME_TYPES.has(file.mimeType.toLowerCase()) ||
    !ALLOWED_IMAGE_EXTENSIONS.has(ext)
  ) {
    return {
      valid: false,
      error:
        'Güvenlik nedeniyle yalnızca JPG, PNG ve WEBP formatındaki gerçek görsel dosyaları yüklenebilir.',
    };
  }

  if (file.sizeBytes <= 0 || file.sizeBytes > MAX_UPLOAD_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Görsel boyutu 5 MB sınırını aşamaz.',
    };
  }

  return { valid: true };
}

const ALLOWED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const ALLOWED_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov']);
const MAX_VIDEO_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export function validateUploadedVideoFile(file: {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}): { valid: boolean; error?: string } {
  if (!file.fileName || !file.mimeType) {
    return { valid: false, error: 'Video adı veya türü eksik.' };
  }

  const lowerName = file.fileName.toLowerCase();
  const dotIndex = lowerName.lastIndexOf('.');
  const ext = dotIndex >= 0 ? lowerName.slice(dotIndex) : '';

  if (
    !ALLOWED_VIDEO_MIME_TYPES.has(file.mimeType.toLowerCase()) ||
    !ALLOWED_VIDEO_EXTENSIONS.has(ext)
  ) {
    return {
      valid: false,
      error: 'Yalnızca MP4, WEBM veya MOV formatında video yüklenebilir.',
    };
  }

  if (file.sizeBytes <= 0 || file.sizeBytes > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Video boyutu 25 MB sınırını aşamaz.',
    };
  }

  return { valid: true };
}

/**
 * Validates actual binary magic bytes so spoofed MIME/extensions cannot bypass upload security.
 */
export function validateMediaMagicBytes(
  buffer: Buffer,
  isVideo: boolean
): boolean {
  if (!buffer || buffer.length < 12) return false;

  if (!isVideo) {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return true;
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return true;
    }
    // WEBP: "RIFF" .... "WEBP"
    if (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
      return true;
    }
    return false;
  }

  // MP4 / MOV: "ftyp" at offset 4
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    return true;
  }
  // WEBM / MKV: 1A 45 DF A3
  if (
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return true;
  }

  return false;
}

/**
 * Prevents javascript:, data:, vbscript: XSS payloads in user/admin-supplied URLs.
 */
export function sanitizeSafeUrl(
  rawUrl: string | null | undefined,
  allowRelative: boolean = true
): string | null {
  const clean = (rawUrl || '').trim();
  if (!clean) return null;

  if (allowRelative && clean.startsWith('/') && !clean.startsWith('//')) {
    return clean;
  }

  // Allow safe base64 media data URLs (never allow data:text/html or data:image/svg+xml)
  if (
    /^data:(image\/(jpeg|jpg|png|webp)|video\/(mp4|webm|quicktime));base64,[A-Za-z0-9+/=]+$/i.test(
      clean
    )
  ) {
    return clean;
  }

  try {
    const parsed = new URL(clean);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    // invalid URL
  }
  return null;
}
