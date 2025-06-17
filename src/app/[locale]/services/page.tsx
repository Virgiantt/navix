import { redirect } from 'next/navigation'

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Server-side redirect to homepage services section
  redirect(`/${locale}/#services`)
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: 'Our Services - Navix Agency',
    description: 'Discover our comprehensive digital marketing and growth services.',
    robots: {
      index: false, // Don't index this redirect page
      follow: true,
    },
    alternates: {
      canonical: `https://navixagency.tech/${locale}/#services`,
      languages: {
        'en': 'https://navixagency.tech/en/#services',
        'fr': 'https://navixagency.tech/fr/#services', 
        'ar': 'https://navixagency.tech/ar/#services',
      }
    }
  }
}