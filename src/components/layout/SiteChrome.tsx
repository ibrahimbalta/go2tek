'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Yönetim paneli (/yonetim) sayfalarında genel site üst menüsü ve alt bilgisini gizler.
 */
export function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith('/yonetim') || pathname.startsWith('/g2t-portal-x94k');

  return (
    <>
      {!isAdmin && navbar}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
    </>
  );
}
