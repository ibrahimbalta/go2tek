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
