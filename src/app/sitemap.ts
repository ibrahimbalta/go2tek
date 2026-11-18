import type { MetadataRoute } from 'next';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { getPublishedProducts } from '@/lib/store-queries';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://go2tek.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/magaza',
    '/butceme-gore-cihaz-bul',
    '/cihazimi-satmak-istiyorum',
    '/hakkimizda',
    '/iletisim',
    '/sss',
    '/gizlilik-ve-kvkk',
    '/mesafeli-satis-ve-iade-kosullari',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const categoryPages = PRODUCT_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/magaza/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // Strictly ONLY published store products (never private buyer/seller requests)
  const products = await getPublishedProducts();
  const productPages = products.map((p) => ({
    url: `${BASE_URL}/urun/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
