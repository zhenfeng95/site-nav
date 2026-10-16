/**
 * SSR HTML still builds /_nuxt URLs from the global cdnURL (Nuxt limitation).
 * Rewrite static asset URLs for CN visitors onto the domestic mirror.
 * @see https://github.com/nuxt/nuxt/issues/31984
 */

const ATTR_RE
  = /(\b(?:src|href))="(\/(?:_nuxt|icons|images)\/[^"]+|\/(?:logo\.png|logo1\.png|favicon\.png|apple-touch-icon\.png|og-image\.(?:png|svg)))"/g

const CSS_URL_QUOTED_RE
  = /url\((['"])(\/(?:_nuxt|icons|images)\/[^'"]+|\/(?:logo\.png|logo1\.png|favicon\.png|apple-touch-icon\.png|og-image\.(?:png|svg)))\1\)/g

const CSS_URL_BARE_RE
  = /url\((\/(?:_nuxt|icons|images)\/[^)]+|\/(?:logo\.png|logo1\.png|favicon\.png|apple-touch-icon\.png|og-image\.(?:png|svg)))\)/g

function rewriteHtml(input: string, cdn: string): string {
  return input
    .replace(ATTR_RE, `$1="${cdn}$2"`)
    .replace(CSS_URL_QUOTED_RE, `url($1${cdn}$2$1)`)
    .replace(CSS_URL_BARE_RE, `url(${cdn}$1)`)
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const cdn = String(event.context.assetCdn || '')
    if (!cdn) {
      return
    }

    const keys = ['head', 'body', 'bodyAppend', 'bodyPrepend'] as const
    for (const key of keys) {
      const chunk = html[key]
      if (!Array.isArray(chunk)) {
        continue
      }
      html[key] = chunk.map(part => (typeof part === 'string' ? rewriteHtml(part, cdn) : part))
    }
  })
})
