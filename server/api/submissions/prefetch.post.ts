export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'prefetch', 20, 60 * 60 * 1000)

  const body = await readBody<{ url?: string }>(event)
  const url = normalizeUrl(String(body?.url ?? ''))

  let response: Response
  try {
    response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'user-agent': 'WanfindBot/1.0 (+https://wanfind.com)',
        accept: 'text/html,application/xhtml+xml',
      },
    })
  }
  catch {
    throw createError({ statusCode: 400, message: '无法访问该地址，请检查链接后重试。' })
  }

  if (!response.ok) {
    throw createError({ statusCode: 400, message: `站点返回异常（${response.status}），请手动填写。` })
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    const host = new URL(url).hostname
    return {
      name: host,
      iconUrl: new URL('/favicon.ico', url).toString(),
      url,
    }
  }

  const html = (await response.text()).slice(0, 200_000)
  const { title, iconUrl } = extractTitleAndIcon(html, url)

  return {
    name: title,
    iconUrl,
    url,
  }
})
