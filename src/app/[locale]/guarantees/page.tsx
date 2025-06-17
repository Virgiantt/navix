import { redirect } from 'next/navigation'

export default async function GuaranteesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Server-side redirect to homepage guarantees section
  redirect(`/${locale}/#guarantees`)
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: 'Our Guarantees - Navix Agency',
    description: 'Learn about our quality guarantees and commitments to delivering exceptional results.',
    robots: {
      index: false, // Don't index this redirect page
      follow: true,
    },
    alternates: {
      canonical: `https://navixagency.tech/${locale}/#guarantees`,
      languages: {
        'en': 'https://navixagency.tech/en/#guarantees',
        'fr': 'https://navixagency.tech/fr/#guarantees', 
        'ar': 'https://navixagency.tech/ar/#guarantees',
      }
    }
  }
}