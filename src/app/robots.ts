import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/studio/',
          '/admin/',
          '/_next/',
          '/private/',
          '/sanity/',
          '/_vercel/',
          '/middleware'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/studio/',
          '/admin/',
          '/_next/'
        ],
        // Help Google understand the redirect pages
        crawlDelay: 1
      },
      // Allow redirect pages but discourage deep crawling
      {
        userAgent: '*',
        allow: [
          '/*/contact',
          '/*/services', 
          '/*/guarantees'
        ],
        crawlDelay: 5  // Slow down crawling of redirect pages
      }
    ],
    sitemap: 'https://navixagency.tech/sitemap.xml',
    host: 'https://navixagency.tech'
  }
}