import siteIconManifest from '~/data/site-icons.json'
import { withAssetCdn } from '~/utils/asset-url'

const localIcons = siteIconManifest as Record<string, string>

/** Local bundled icon path by navigation item id, if available. */
export function getLocalIconPath(id?: string): string | undefined {
  if (!id) {
    return undefined
  }
  return localIcons[id]
}

/** Prefer same-origin / data URLs so the UI never probes third-party favicon CDNs. */
function isBundledIconUrl(value: string): boolean {
  return value.startsWith('/') || value.startsWith('data:')
}

/**
 * Build favicon URL candidates for display.
 * Order: local manifest → bundled/data iconUrl. No Google / DDG / favicon.im probes.
 * Missing icons fall through to the letter placeholder in SiteTile.
 */
export function getFaviconCandidates(
  _url: string,
  _size = 64,
  iconUrl?: string,
  id?: string,
  assetCdn = '',
): string[] {
  const list: string[] = []

  const local = getLocalIconPath(id)
  if (local) {
    list.push(local)
  }

  if (iconUrl && isBundledIconUrl(iconUrl)) {
    list.push(iconUrl)
  }

  return [...new Set(list)].map(entry => withAssetCdn(entry, assetCdn))
}

export function getFaviconUrl(
  url: string,
  size = 64,
  iconUrl?: string,
  id?: string,
  assetCdn = '',
): string {
  return getFaviconCandidates(url, size, iconUrl, id, assetCdn)[0] ?? ''
}
