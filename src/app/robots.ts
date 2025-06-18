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
          '/middleware',
          // Block nested locale patterns
          '/*/en/*',
          '/*/fr/*', 
          '/*/ar/*',
          // Block test URLs
          '/*/*/test*',
          '/*/*test*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/studio/',
          '/admin/',
          '/_next/',
          // Block nested locale patterns for Google
          '/*/en/*',
          '/*/fr/*',
          '/*/ar/*',
          // Block test URLs
          '/*/*/test*',
          '/*/*test*'
        ],
        crawlDelay: 1
      }
    ],
    sitemap: 'https://www.navixagency.tech/sitemap.xml',
    host: 'https://www.navixagency.tech'
  }
}