/**
 * Cloudflare CF-IPCountry:
 * - CN: point Nuxt runtime cdnURL at the domestic static mirror
 * - others: keep same-origin assets on wanfind.com
 */
export default defineEventHandler((event) => {
  const country = (getRequestHeader(event, 'cf-ipcountry') || '').trim().toUpperCase()
  const isCn = country === 'CN'
  event.context.isCn = isCn

  const config = useRuntimeConfig(event)
  const cdn = String(config.public.cnAssetCdn || '').replace(/\/$/, '')

  if (isCn && cdn) {
    // Client payload / dynamic imports read this per-request config.
    config.app.cdnURL = `${cdn}/`
    event.context.assetCdn = cdn
  }
  else {
    config.app.cdnURL = ''
    event.context.assetCdn = ''
  }
})
