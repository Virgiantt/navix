import { redirect } from 'next/navigation'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Server-side redirect to meeting page (which is the actual contact page)
  redirect(`/${locale}/meeting`)
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: 'Contact Us - Navix Agency',
    description: 'Get in touch with Navix Agency for your digital marketing needs.',
    robots: {
      index: false, // Don't index this redirect page
      follow: true,
    },
    alternates: {
      canonical: `https://navixagency.tech/${locale}/meeting`,
      languages: {
        'en': 'https://navixagency.tech/en/meeting',
        'fr': 'https://navixagency.tech/fr/meeting', 
        'ar': 'https://navixagency.tech/ar/meeting',
      }
    }
  }
}