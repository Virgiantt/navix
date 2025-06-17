"use client"

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function GuaranteesPage({ params }: { params: { locale: string } }) {
  useEffect(() => {
    // Redirect to homepage guarantees section
    redirect(`/${params.locale}/#guarantees`)
  }, [params.locale])

  return null
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    title: 'Our Guarantees - Navix Agency',
    description: 'Learn about our quality guarantees and commitments to delivering exceptional results.',
    robots: {
      index: false, // Don't index this redirect page
      follow: true,
    },
    alternates: {
      canonical: `https://navixagency.tech/${params.locale}/#guarantees`,
      languages: {
        'en': 'https://navixagency.tech/en/#guarantees',
        'fr': 'https://navixagency.tech/fr/#guarantees', 
        'ar': 'https://navixagency.tech/ar/#guarantees',
      }
    }
  }
}