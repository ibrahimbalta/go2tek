import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Go2Tek | 2.El Teknoloji Mağazası & Özel Talep Eşleştirme Platformu',
  description:
    'Go2Tek 2.El Teknoloji Mağazası: Garantili 2.El Bilgisayar, Notebook, Telefon, Tablet, Aksesuar mağaza satışı ve gizli özel alım-satım talep eşleştirme merkezi. Teknolojide Doğru Adres!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
