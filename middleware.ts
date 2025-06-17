import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'ar'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always show the locale in the URL
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Block invalid nested locale patterns (e.g., /en/en/projects)
  const nestedLocalePattern = /^\/(en|fr|ar)\/(en|fr|ar)\/.*$/;
  if (nestedLocalePattern.test(pathname)) {
    // Extract the first locale and the rest of the path after the duplicate
    const match = pathname.match(/^\/(en|fr|ar)\/(en|fr|ar)\/(.*)$/);
    if (match) {
      const [, firstLocale, , restPath] = match;
      const correctedUrl = new URL(`/${firstLocale}/${restPath}`, request.url);
      return NextResponse.redirect(correctedUrl, 301);
    }
  }

  // Handle contact page redirects to meeting
  if (pathname.match(/^\/(en|fr|ar)\/contact\/?$/)) {
    const locale = pathname.split('/')[1];
    const meetingUrl = new URL(`/${locale}/meeting`, request.url);
    return NextResponse.redirect(meetingUrl, 301);
  }

  // Handle services page redirects to homepage with anchor
  if (pathname.match(/^\/(en|fr|ar)\/services\/?$/)) {
    const locale = pathname.split('/')[1];
    const homeUrl = new URL(`/${locale}/#services`, request.url);
    return NextResponse.redirect(homeUrl, 301);
  }

  // Handle guarantees page redirects to homepage with anchor
  if (pathname.match(/^\/(en|fr|ar)\/guarantees\/?$/)) {
    const locale = pathname.split('/')[1];
    const homeUrl = new URL(`/${locale}/#guarantees`, request.url);
    return NextResponse.redirect(homeUrl, 301);
  }

  // Block crawling of known problematic patterns
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  
  if (isBot) {
    // Block malformed URLs for bots to prevent crawl budget waste
    const malformedPatterns = [
      /^\/(en|fr|ar)\/(en|fr|ar)\//,  // Nested locales
      /.*\/\/.*/, // Double slashes
      /.*\/{3,}.*/, // Triple+ slashes
    ];
    
    if (malformedPatterns.some(pattern => pattern.test(pathname))) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Continue with next-intl middleware for valid requests
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, exclude API routes
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    '/(ar|fr|en)/:path*',
    
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    // BUT exclude API routes, static files, and Next.js internals
    '/((?!api|_next|_vercel|studio|.*\\..*).*)'
  ]
};