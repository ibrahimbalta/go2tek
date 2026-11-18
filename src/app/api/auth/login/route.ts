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
    const ipRate = checkRateLimit(`admin-login-ip:${ip}`, 10, 60_000);
    if (!ipRate.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla giriş denemesi yapıldı. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur.' },
        { status: 400 }
      );
    }

    const accountRate = checkRateLimit(
      `admin-login-acct:${ip}:${cleanEmail}`,
      5,
      5 * 60_000
    );
    if (!accountRate.allowed) {
      return NextResponse.json(
        {
          error:
            'Güvenlik nedeniyle bu hesap için giriş geçici olarak kilitlendi. 5 dakika sonra tekrar deneyin.',
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.isActive || !verifyPassword(String(password), user.passwordHash)) {
      await prisma.auditLog
        .create({
          data: {
            userEmail: cleanEmail,
            userRole: 'UNKNOWN',
            action: 'LOGIN_FAILED',
            entityType: 'User',
            entityId: user?.id || 'UNKNOWN',
            details: `Başarısız yönetim girişi denemesi (${cleanEmail}).`,
            ipAddress: ip,
          },
        })
        .catch(() => {});

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
      secure: process.env.NODE_ENV === 'production',
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
