/** Static paths that may be served from the domestic asset CDN for CN visitors. */
const ASSET_PATH_RE
  = /^\/(?:_nuxt\/|icons\/|images\/|logo\.png$|logo1\.png$|favicon\.png$|apple-touch-icon\.png$|og-image\.(?:png|svg)$)/

/** Prefix a same-origin static path with the asset CDN base when present. */
export function withAssetCdn(path: string, cdn: string): string {
  if (!cdn || !path) {
    return path
  }
  if (
    path.startsWith('data:')
    || path.startsWith('http://')
    || path.startsWith('https://')
    || path.startsWith('//')
  ) {
    return path
  }
  if (!path.startsWith('/') || path.startsWith('/api/') || path === '/api') {
    return path
  }
  if (!ASSET_PATH_RE.test(path)) {
    return path
  }
  return `${cdn.replace(/\/$/, '')}${path}`
}
