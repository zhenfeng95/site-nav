/**
 * 首页与信任页可收录；导航功能区 noindex（页面仍可访问）。
 */
export const INDEXABLE_STATIC_PATHS: readonly string[] = [
  '/',
  '/about',
  '/disclaimer',
  '/privacy',
  '/contact',
  '/apply',
]

export const NOINDEX_PATH_PREFIXES: readonly string[] = [
  '/nav',
  '/admin',
]

export function normalizeSitePath(path: string): string {
  const withLeading = path.startsWith('/') ? path : `/${path}`
  if (withLeading.length > 1 && withLeading.endsWith('/')) {
    return withLeading.slice(0, -1)
  }
  return withLeading
}

export function isPublicIndexablePath(path: string): boolean {
  const normalized = normalizeSitePath(path)

  for (const prefix of NOINDEX_PATH_PREFIXES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return false
    }
  }

  return INDEXABLE_STATIC_PATHS.includes(normalized)
}

export function listPublicIndexablePaths(extraPaths: string[] = []): string[] {
  const merged = [...INDEXABLE_STATIC_PATHS, ...extraPaths]
  const seen = new Set<string>()
  const out: string[] = []

  for (const path of merged) {
    const normalized = normalizeSitePath(path)
    if (!isPublicIndexablePath(normalized)) {
      continue
    }
    if (!seen.has(normalized)) {
      seen.add(normalized)
      out.push(normalized)
    }
  }

  return out
}
