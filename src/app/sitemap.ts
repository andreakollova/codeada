import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://coduy.com';
  const now = new Date().toISOString();

  const staticPages = [
    { url: base, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${base}/glossary`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/topics`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${base}/workshop`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${base}/reels`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.6 },
  ];

  // Generate theory lesson URLs (1-296)
  const theoryPages = Array.from({ length: 296 }, (_, i) => ({
    url: `${base}/theory/${i + 1}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...theoryPages];
}
