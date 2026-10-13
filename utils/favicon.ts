import siteIconManifest from '~/data/site-icons.json'

function apexDomain(host: string): string {
  const parts = host.split('.').filter(Boolean)
  if (parts.length <= 2) {
    return host
  }
  return parts.slice(-2).join('.')
}

const localIcons = siteIconManifest as Record<string, string>

/** Local bundled icon path by navigation item id, if available. */
export function getLocalIconPath(id?: string): string | undefined {
  if (!id) {
    return undefined
  }
  return localIcons[id]
}

/** Build favicon URL candidates for a site (local first, then remotes). */
export function getFaviconCandidates(
  url: string,
  size = 64,
  iconUrl?: string,
  id?: string,
): string[] {
  const list: string[] = []

  const local = getLocalIconPath(id)
  if (local) {
    list.push(local)
  }

  if (iconUrl) {
    list.push(iconUrl)
  }

  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const apex = apexDomain(host)
    const hosts = host === apex ? [host] : [host, apex]

    for (const h of hosts) {
      list.push(
        `https://${h}/favicon.ico`,
        `https://www.${h}/favicon.ico`,
        `https://www.google.com/s2/favicons?domain=${encodeURIComponent(h)}&sz=${size}`,
        `https://icons.duckduckgo.com/ip3/${h}.ico`,
        `https://favicon.im/${encodeURIComponent(h)}?larger=true`,
      )
    }
  }
  catch {
    // ignore invalid urls
  }

  return [...new Set(list)]
}

export function getFaviconUrl(url: string, size = 64, iconUrl?: string, id?: string): string {
  return getFaviconCandidates(url, size, iconUrl, id)[0] ?? ''
}
