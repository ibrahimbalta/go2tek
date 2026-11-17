import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Go2Tek | İkinci El Teknoloji E-Ticaret ve Özel Talep Eşleştirme Platformu',
  description:
    'Go2Tek mağaza stoklarından 14 noktalı teknik kontrol onaylı ikinci el notebook, tablet, masaüstü bilgisayar satın alın veya bütçenize göre özel cihaz talebi oluşturun.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
