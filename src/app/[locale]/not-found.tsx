import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t ? t('title') : 'Page Not Found'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t ? t('description') : 'The page you are looking for does not exist.'}
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t ? t('backHome') : 'Back to Home'}
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-sm">
            <Link href="/projects" className="font-medium text-blue-600 hover:text-blue-500">
              {t ? t('viewProjects') : 'View Our Projects'}
            </Link>
            <span className="mx-2 text-gray-300">|</span>
            <Link href="/meeting" className="font-medium text-blue-600 hover:text-blue-500">
              {t ? t('contactUs') : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
