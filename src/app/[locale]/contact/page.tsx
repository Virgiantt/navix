"use client"

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function ContactPage({ params }: { params: { locale: string } }) {
  useEffect(() => {
    // Redirect to meeting page (which is the actual contact page)
    redirect(`/${params.locale}/meeting`)
  }, [params.locale])

  return null
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    title: 'Contact Us - Navix Agency',
    description: 'Get in touch with Navix Agency for your digital marketing needs.',
    robots: {
      index: false, // Don't index this redirect page
      follow: true,
    },
    alternates: {
      canonical: `https://navixagency.tech/${params.locale}/meeting`,
      languages: {
        'en': 'https://navixagency.tech/en/meeting',
        'fr': 'https://navixagency.tech/fr/meeting', 
        'ar': 'https://navixagency.tech/ar/meeting',
      }
    }
  }
}