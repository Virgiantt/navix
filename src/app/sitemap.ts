import { MetadataRoute } from 'next'
import { fetchProjects } from '@/services/projectService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.navixagency.tech'
  const locales = ['en', 'fr', 'ar']
  
  // Main pages for each locale (meeting is the contact page)
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const }, // Homepage more dynamic than daily
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/projects', priority: 0.9, changeFreq: 'weekly' as const }, // High priority for portfolio
    { path: '/meeting', priority: 0.8, changeFreq: 'monthly' as const }
  ]

  // Generate sitemap entries for main pages (one entry per page with alternates)
  const sitemap: MetadataRoute.Sitemap = []

  pages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/en${page.path}`,
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

  // Add redirect pages (contact, services, guarantees) with lower priority
  const redirectPages = ['/contact', '/services', '/guarantees']
  redirectPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/en${page}`,
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

  // Fetch real project slugs from CMS
  try {
    const projects = await fetchProjects()
    
    projects.forEach(project => {
      // Only include projects with valid slugs and exclude test/temporary projects
      if (project.slug && 
          project.slug.trim() !== '' && 
          !project.slug.includes('test') &&
          !project.slug.includes('temp') &&
          !project.slug.endsWith('t') && // Fix for mitutoyo-management-systemt
          !project.slug.includes('mitutoyo-management-systemt') && // Explicit exclusion
          project.slug.length > 2 &&
          project.slug !== 'test') {
        
        // Create one entry per project (using default locale) with alternates
        sitemap.push({
          url: `${baseUrl}/en/projects/${project.slug}`,
          lastModified: new Date(project._updatedAt || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          alternates: {
            languages: {
              'en': `${baseUrl}/en/projects/${project.slug}`,
              'fr': `${baseUrl}/fr/projects/${project.slug}`,
              'ar': `${baseUrl}/ar/projects/${project.slug}`,
            }
          }
        })
      }
    })
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    // Continue without project URLs if there's an error
  }

  return sitemap
}