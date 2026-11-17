import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { getSiteSettings } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.siteTitle,
    description:
      '2.El Bilgisayar, Notebook, Telefon, Tablet ve Aksesuar mağaza satışı ile gizli özel alım-satım talep eşleştirme merkezi.',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 antialiased">
        <SettingsProvider
          value={{ whatsappNumber: settings.whatsappNumber, phone: settings.phone }}
        >
        <CartProvider>
          <SiteChrome
            navbar={
              <Navbar topBarText={settings.topBarText} phone={settings.phone} />
            }
            footer={<Footer />}
          >
            {children}
          </SiteChrome>
        </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
