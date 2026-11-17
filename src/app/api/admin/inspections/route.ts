import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      transactionId,
      sellerOfferId,
      productId,
      deviceBrandModel,
      deviceSerialNumber,
      inspectorName,
      screenTest,
      keyboardTest,
      touchpadTest,
      usbPortsTest,
      wifiTest,
      cameraTest,
      speakerTest,
      microphoneTest,
      storageHealthTest,
      ramTest,
      cpuThermalTest,
      batteryHealthTest,
      chargerAdapterTest,
      cosmeticCheck,
      overallStatus,
      summaryNotes,
      photos,
    } = body;

    if (!deviceBrandModel || !summaryNotes) {
      return NextResponse.json(
        { error: 'Cihaz marka/model ve teknik kontrol açıklama alanları zorunludur.' },
        { status: 400 }
      );
    }

    const randCode = Math.floor(100 + Math.random() * 900);
    const inspectionCode = `G2T-TK-2026-${randCode}`;

    const record = await prisma.technicalInspection.create({
      data: {
        inspectionCode,
        transactionId: transactionId || null,
        sellerOfferId: sellerOfferId || null,
        productId: productId || null,
        inspectorUserId: session.userId,
        inspectorName: String(inspectorName || session.name).trim(),
        deviceBrandModel: String(deviceBrandModel).trim(),
        deviceSerialNumber: String(deviceSerialNumber || 'Belirtilmedi').trim(),
        screenTest: String(screenTest || 'PASS'),
        keyboardTest: String(keyboardTest || 'PASS'),
        touchpadTest: String(touchpadTest || 'PASS'),
        usbPortsTest: String(usbPortsTest || 'PASS'),
        wifiTest: String(wifiTest || 'PASS'),
        cameraTest: String(cameraTest || 'PASS'),
        speakerTest: String(speakerTest || 'PASS'),
        microphoneTest: String(microphoneTest || 'PASS'),
        storageHealthTest: String(storageHealthTest || 'PASS'),
        ramTest: String(ramTest || 'PASS'),
        cpuThermalTest: String(cpuThermalTest || 'PASS'),
        batteryHealthTest: String(batteryHealthTest || 'PASS'),
        chargerAdapterTest: String(chargerAdapterTest || 'PASS'),
        cosmeticCheck: String(cosmeticCheck || 'PASS'),
        overallStatus: String(overallStatus || 'PASSED'),
        summaryNotes: String(summaryNotes).trim(),
        photos: JSON.stringify(
          Array.isArray(photos) && photos.length > 0
            ? photos
            : ['/images/products/macbook-pro-14.svg']
        ),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        userEmail: session.email,
        userRole: session.role,
        action: 'TECHNICAL_INSPECTION_CREATED',
        entityType: 'TechnicalInspection',
        entityId: record.id,
        details: `${record.inspectionCode} - ${record.deviceBrandModel} (${record.overallStatus}) teknik kontrol kaydı oluşturuldu.`,
      },
    });

    return NextResponse.json({
      success: true,
      inspection: record,
    });
  } catch (error) {
    console.error('Inspection creation error:', error);
    return NextResponse.json(
      { error: 'Teknik kontrol kaydedilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
