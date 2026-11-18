import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/yonetim', '/g2t-portal-x94k', '/api/'],
      },
    ],
    sitemap: 'https://go2tek.vercel.app/sitemap.xml',
  };
}
