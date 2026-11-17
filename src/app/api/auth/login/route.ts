import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifyPassword,
  signAdminToken,
  AUTH_COOKIE_NAME,
  SessionPayload,
} from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`admin-login:${ip}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla giriş denemesi yapıldı. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user || !user.isActive || !verifyPassword(String(password), user.passwordHash)) {
      return NextResponse.json(
        { error: 'Geçersiz yönetici/personel e-postası veya şifre.' },
        { status: 401 }
      );
    }

    const payload: SessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as SessionPayload['role'],
    };

    const token = await signAdminToken(payload);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        details: `${user.name} (${user.role}) yönetim paneline giriş yaptı.`,
        ipAddress: ip,
      },
    });

    const res = NextResponse.json({
      success: true,
      user: payload,
    });

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
