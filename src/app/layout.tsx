import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { getSiteSettings } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://go2tek.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.siteTitle;
  const description =
    'Bartın / Merkez Go2Tek 2.El Teknoloji Mağazası: Test edilmiş ikinci el bilgisayar, notebook, telefon, tablet ve aksesuarlar. Değerinde nakit alım, takas ve bütçenize göre özel cihaz eşleştirme.';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s | Go2Tek Bartın',
    },
    description,
    keywords: [
      'Bartın ikinci el bilgisayar',
      'Bartın 2. el laptop',
      'Bartın notebook alım satım',
      'Bartın ikinci el telefon',
      'Bartın tablet',
      'bilgisayar takas Bartın',
      'Go2Tek',
      '2. el teknoloji mağazası',
    ],
    authors: [{ name: 'İbrahim BALTA', url: 'https://www.linkedin.com/in/ibrahimbalta/' }],
    creator: 'Go2Tek',
    publisher: 'Go2Tek',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: SITE_URL,
      siteName: 'Go2Tek | 2.El Teknoloji Mağazası',
      title,
      description,
      images: [
        {
          url: '/images/go2tek-hakkimizda.jpg',
          width: 1200,
          height: 630,
          alt: 'Go2Tek Bartın 2.El Teknoloji Mağazası',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/go2tek-hakkimizda.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'Go2Tek 2.El Teknoloji Mağazası',
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    image: `${SITE_URL}/images/go2tek-hakkimizda.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Merkez',
      addressRegion: 'Bartın',
      addressCountry: 'TR',
    },
    openingHours: 'Mo-Sa 09:00-19:00',
  };

  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
