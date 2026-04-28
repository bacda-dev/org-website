/**
 * robots.txt — allow public site, disallow admin + API, point at sitemap.
 * Served at `/robots.txt` by Next.js.
 */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://bayareacreativedancers.org'
  ).replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api', '/api/*'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
