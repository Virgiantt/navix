import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'ar'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // The pathname prefix strategy
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      fr: '/a-propos',
      ar: '/معلومات-عنا'
    },
    '/projects': {
      en: '/projects',
      fr: '/projets',
      ar: '/المشاريع'
    },
    '/meeting': {
      en: '/meeting',
      fr: '/reunion',
      ar: '/اجتماع'
    }
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);