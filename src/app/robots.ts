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
          '/private/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/studio/'],
      },
    ],
    sitemap: 'https://navigagency.tech/sitemap.xml',
    host: 'https://navigagency.tech'
  }
}