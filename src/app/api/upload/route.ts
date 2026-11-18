import { NextRequest, NextResponse } from 'next/server';
import {
  validateUploadedImageFile,
  validateUploadedVideoFile,
  validateMediaMagicBytes,
} from '@/lib/security';
import { checkRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`upload:${ip}`, 15, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla dosya yükleme denemesi yapıldı.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mediaType = String(formData.get('type') || '');

    if (!file) {
      return NextResponse.json({ error: 'Dosya seçilmedi.' }, { status: 400 });
    }

    const isVideo =
      mediaType === 'video' || file.type.toLowerCase().startsWith('video/');

    const validation = isVideo
      ? validateUploadedVideoFile({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        })
      : validateUploadedImageFile({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!validateMediaMagicBytes(buffer, isVideo)) {
      return NextResponse.json(
        {
          error:
            'Dosya içeriği geçerli bir görsel veya video formatıyla eşleşmiyor.',
        },
        { status: 400 }
      );
    }

    const ext =
      path.extname(file.name).toLowerCase() || (isVideo ? '.mp4' : '.jpg');
    const safeFileName = `${isVideo ? 'video' : 'device'}-${crypto.randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, safeFileName), buffer);

    return NextResponse.json({
      success: true,
      mediaType: isVideo ? 'video' : 'image',
      url: `/uploads/${safeFileName}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
