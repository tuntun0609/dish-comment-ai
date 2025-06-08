import { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'

// Adapt this as necessary
const host = process.env.BASE_URL || 'http://localhost:3000'

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'
  | undefined

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['']

  const pagesSiteMap = staticPages.flatMap(page => {
    return routing.locales.map(locale => ({
      url: `${host}${locale === routing.defaultLocale ? '' : `/${locale}`}${page}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: page === '' ? 1.0 : 0.8,
    }))
  })

  return [...pagesSiteMap]
}
