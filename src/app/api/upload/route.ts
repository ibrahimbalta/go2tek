import { NextRequest, NextResponse } from 'next/server';
import { validateUploadedImageFile } from '@/lib/security';
import { checkRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`upload:${ip}`, 12, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla dosya yükleme denemesi yapıldı.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya seçilmedi.' }, { status: 400 });
    }

    const validation = validateUploadedImageFile({
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const safeFileName = `device-${crypto.randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, safeFileName), buffer);

    return NextResponse.json({
      success: true,
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
