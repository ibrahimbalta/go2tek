import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yalnızca Genel Yönetici (ADMIN) personel ekleyebilir.' },
        { status: 403 }
      );
    }

    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Ad soyad, e-posta ve şifre zorunludur.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email: String(email).trim().toLowerCase() },
      create: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        passwordHash: hashPassword(String(password)),
        role: String(role || 'SALES_STAFF'),
        isActive: true,
      },
      update: {
        name: String(name).trim(),
        passwordHash: hashPassword(String(password)),
        role: String(role || 'SALES_STAFF'),
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Personel kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  }
}
