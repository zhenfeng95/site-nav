import { withAssetCdn } from '~/utils/asset-url'

/** Domestic CDN base for CN visitors; empty for others / local dev payload. */
export function useAssetCdn() {
  return useState<string>('asset-cdn', () => '')
}

/** Resolve a public asset path, prefixing the CN CDN when active. */
export function assetUrl(path: string): string {
  return withAssetCdn(path, useAssetCdn().value)
}

export function useAssetUrl(path: MaybeRefOrGetter<string>) {
  const cdn = useAssetCdn()
  return computed(() => withAssetCdn(toValue(path), cdn.value))
}
