"use client"

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function ServicesPage({ params }: { params: { locale: string } }) {
  useEffect(() => {
    // Redirect to homepage services section
    redirect(`/${params.locale}/#services`)
  }, [params.locale])

  return null
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    title: 'Our Services - Navix Agency',
    description: 'Discover our comprehensive digital marketing and growth services.',
    robots: {
      index: false, // Don't index this redirect page
      follow: true,
    },
    alternates: {
      canonical: `https://navixagency.tech/${params.locale}/#services`,
      languages: {
        'en': 'https://navixagency.tech/en/#services',
        'fr': 'https://navixagency.tech/fr/#services', 
        'ar': 'https://navixagency.tech/ar/#services',
      }
    }
  }
}