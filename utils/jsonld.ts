import { SITE_CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME } from '~/utils/site'

function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildHomeJsonLd(siteUrl: string) {
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl(siteUrl, '/favicon.png'),
        },
        email: SITE_CONTACT_EMAIL,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DESCRIPTION,
        inLanguage: 'zh-CN',
        publisher: {
          '@id': organizationId,
        },
      },
    ],
  }
}
