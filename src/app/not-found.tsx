import { headers } from 'next/headers'
import { Link } from '@/i18n/routing'

export default async function GlobalNotFound() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Extract locale from pathname, default to 'en'
  const localeMatch = pathname.match(/^\/(en|fr|ar)/)
  const locale = localeMatch ? localeMatch[1] : 'en'

  // Translations for 404 page
  const translations = {
    en: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
      backHome: 'Back to Home',
      viewProjects: 'View Our Projects',
      contactUs: 'Contact Us'
    },
    fr: {
      title: 'Page Non Trouvée',
      description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
      backHome: 'Retour à l\'Accueil',
      viewProjects: 'Voir Nos Projets',
      contactUs: 'Nous Contacter'
    },
    ar: {
      title: 'الصفحة غير موجودة',
      description: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      backHome: 'العودة للرئيسية',
      viewProjects: 'عرض مشاريعنا',
      contactUs: 'اتصل بنا'
    }
  }

  const t = translations[locale as keyof typeof translations] || translations.en
  const isRTL = locale === 'ar'

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <h1 className="text-9xl font-bold text-gray-300">404</h1>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t.description}
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href={`/${locale}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t.backHome}
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-sm">
                <Link href={`/${locale}/projects`} className="font-medium text-blue-600 hover:text-blue-500">
                  {t.viewProjects}
                </Link>
                <span className="mx-2 text-gray-300">|</span>
                <Link href={`/${locale}/meeting`} className="font-medium text-blue-600 hover:text-blue-500">
                  {t.contactUs}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
