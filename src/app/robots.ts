import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/projects/'],
    },
    sitemap: ['https://coduy.com/sitemap.xml', 'https://coduy.sk/sitemap.xml'],
  };
}
