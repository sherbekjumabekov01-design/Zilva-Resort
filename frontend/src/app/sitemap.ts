import { MetadataRoute } from 'next';
import { fallbackRooms } from '@/data/rooms';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zilvaresort.uz';

  const staticRoutes = [
    '',
    '/rooms',
    '/spa',
    '/restaurant',
    '/activities',
    '/events',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const roomRoutes = fallbackRooms.map((room) => ({
    url: `${baseUrl}/rooms/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...roomRoutes];
}
