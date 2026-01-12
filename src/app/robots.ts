import { MetadataRoute } from 'next';
import { META } from '@/constants/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${META.url}/sitemap.xml`,
  };
}
