import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';
import {
  getHeroSlides,
  getSiteSettings,
  saveHeroSlides,
  saveSiteSettings,
} from '@/lib/site-config';
import { sanitizeSafeUrl } from '@/lib/security';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }
  const [siteSettings, heroSlides] = await Promise.all([
    getSiteSettings(),
    getHeroSlides(),
  ]);
  return NextResponse.json({ siteSettings, heroSlides });
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const body = await req.json();

    if (body.siteSettings) {
      await saveSiteSettings(body.siteSettings);

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          userEmail: session.email,
          userRole: session.role,
          action: 'SITE_SETTINGS_UPDATED',
          entityType: 'SiteConfig',
          entityId: 'site_settings',
          details: 'Genel site ayarları, iletişim ve kurumsal metinler güncellendi.',
        },
      });
    }

    if (body.heroSlides && Array.isArray(body.heroSlides)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sanitizedSlides = body.heroSlides.map((s: any) => ({
        ...s,
        image: sanitizeSafeUrl(s.image) || '',
        featuredCard: {
          ...s.featuredCard,
          href: sanitizeSafeUrl(s.featuredCard?.href) || '/magaza',
        },
        primaryCta: {
          ...s.primaryCta,
          href: sanitizeSafeUrl(s.primaryCta?.href) || '/magaza',
        },
        secondaryCta: {
          ...s.secondaryCta,
          href: sanitizeSafeUrl(s.secondaryCta?.href) || '/hakkimizda',
        },
      }));
      await saveHeroSlides(sanitizedSlides);

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          userEmail: session.email,
          userRole: session.role,
          action: 'HERO_SLIDES_UPDATED',
          entityType: 'SiteConfig',
          entityId: 'hero_slides',
          details: `Ana sayfa slider içerikleri güncellendi (${body.heroSlides.length} slayt).`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Site config update error:', error);
    return NextResponse.json(
      { error: 'Site ayarları güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}
