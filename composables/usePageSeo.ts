import { buildHomeJsonLd } from '~/utils/jsonld'
import { isPublicIndexablePath } from '~/utils/seo-index'
import { homeSeo, SITE_NAME } from '~/utils/site'

export function useJsonLd(key: string, data: unknown) {
  useHead({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data),
      },
    ],
  })
}

interface PageSeoInput {
  title: string
  description: string
  path?: string
  ogImage?: string
  noindex?: boolean
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const image = input.ogImage ?? `${siteUrl}/og-image.png`
  const title = input.title.includes(SITE_NAME) ? input.title : `${input.title}｜${SITE_NAME}`
  const description = input.description
  const indexable = Boolean(input.path && isPublicIndexablePath(input.path))

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    robots: input.noindex
      ? 'noindex, nofollow'
      : indexable
        ? 'index, follow'
        : 'noindex, follow',
  })

  useHead({
    link: input.noindex || !input.path
      ? []
      : [{ rel: 'canonical', href: `${siteUrl}${input.path}` }],
  })
}

export function useHomeSeo() {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

  usePageSeo({
    title: homeSeo.title,
    description: homeSeo.description,
    path: '/',
  })

  useJsonLd('ld-json-home', buildHomeJsonLd(siteUrl))
}
