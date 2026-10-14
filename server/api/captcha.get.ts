export default defineEventHandler((event) => {
  assertRateLimit(event, 'captcha', 30, 10 * 60 * 1000)
  const { svg } = issueCaptcha(event)
  setHeader(event, 'content-type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'no-store')
  return svg
})
