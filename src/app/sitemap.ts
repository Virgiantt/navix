import { MetadataRoute } from 'next'
import { fetchProjects } from '@/services/projectService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://navixagency.tech'
  const locales = ['en', 'fr', 'ar']
  
  // Main pages for each locale (meeting is the contact page)
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const }, // Homepage more dynamic than daily
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/projects', priority: 0.9, changeFreq: 'weekly' as const }, // High priority for portfolio
    { path: '/meeting', priority: 0.8, changeFreq: 'monthly' as const }
  ]

  // Generate sitemap entries for all locale + page combinations
  const sitemap: MetadataRoute.Sitemap = []

  locales.forEach(locale => {
    pages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: {
            'en': `${baseUrl}/en${page.path}`,
            'fr': `${baseUrl}/fr${page.path}`, 
            'ar': `${baseUrl}/ar${page.path}`,
          }
        }
      })
    })
  })

  // Add redirect pages (contact, services, guarantees) with lower priority
  const redirectPages = ['/contact', '/services', '/guarantees']
  locales.forEach(locale => {
    redirectPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const, // Redirect pages rarely change
        priority: 0.1, // Very low priority for redirect pages
        alternates: {
          languages: {
            'en': `${baseUrl}/en${page}`,
            'fr': `${baseUrl}/fr${page}`, 
            'ar': `${baseUrl}/ar${page}`,
          }
        }
      })
    })
  })

  // Fetch real project slugs from CMS
  try {
    const projects = await fetchProjects()
    
    projects.forEach(project => {
      if (project.slug) {
        locales.forEach(locale => {
          sitemap.push({
            url: `${baseUrl}/${locale}/projects/${project.slug}`,
            lastModified: new Date(project._updatedAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.7, // Individual projects slightly lower than projects page
            alternates: {
              languages: {
                'en': `${baseUrl}/en/projects/${project.slug}`,
                'fr': `${baseUrl}/fr/projects/${project.slug}`,
                'ar': `${baseUrl}/ar/projects/${project.slug}`,
              }
            }
          })
        })
      }
    })
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    // Continue without project URLs if there's an error
  }

  return sitemap
}