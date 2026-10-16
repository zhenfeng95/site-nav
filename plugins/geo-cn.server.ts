/**
 * Hydrate CN flags for client: 51.la gate + asset CDN base for img/public paths.
 */
export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  const isCn = Boolean(event?.context.isCn)
  const assetCdn = String(event?.context.assetCdn || '')

  useState<boolean>('la51-cn-only', () => false).value = isCn
  useState<string>('asset-cdn', () => '').value = assetCdn
})
