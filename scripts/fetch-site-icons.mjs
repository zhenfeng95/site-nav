#!/usr/bin/env node
/**
 * Download navigation site icons into public/icons/sites and
 * rewrite data/navigation.json iconUrl + data/site-icons.json.
 *
 * Usage: node scripts/fetch-site-icons.mjs
 */
import { mkdir, readFile, writeFile, readdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'data/navigation.json')
const outDir = path.join(root, 'public/icons/sites')
const manifestPath = path.join(root, 'data/site-icons.json')
const TIMEOUT_MS = 4500
const MIN_BYTES = 200

/** Manual fallbacks when site favicon endpoints are blocked / rate-limited. */
const OVERRIDES = {
  chatgpt: 'https://cdn.oaistatic.com/assets/favicon-miwirzcw.ico',
  claude: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/claude-ai.png',
  gemini: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png',
  npm: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/npm.png',
  notion: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/notion.png',
  gmail: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/gmail.png',
  outlook: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/microsoft-outlook.png',
  translate: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-translate.png',
  'google-analytics': 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-analytics.png',
  'google-search-console': 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google.png',
  stackoverflow: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
  dribbble: 'https://favicon.im/dribbble.com?larger=true',
  coolors: 'https://favicon.im/coolors.co?larger=true',
  'shenma-webmaster': 'https://favicon.im/zhanzhang.sm.cn?larger=true',
  'baidu-pan': 'https://favicon.im/pan.baidu.com?larger=true',
  'aliyun-pan': 'https://favicon.im/www.alipan.com?larger=true',
  'quark-pan': 'https://pan.quark.cn/favicon.ico',
  'xunlei-pan': 'https://favicon.im/pan.xunlei.com?larger=true',
  'tianyi-pan': 'https://favicon.im/cloud.189.cn?larger=true',
  onedrive: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/microsoft-onedrive.png',
  'tencent-video': 'https://favicon.im/v.qq.com?larger=true',
  youku: 'https://favicon.im/www.youku.com?larger=true',
  iqiyi: 'https://favicon.im/www.iqiyi.com?larger=true',
  cctv: 'https://favicon.im/tv.cctv.com?larger=true',
  douyin: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/tiktok.png',
  huya: 'https://favicon.im/www.huya.com?larger=true',
  douyu: 'https://favicon.im/www.douyu.com?larger=true',
  tinypng: 'https://tinypng.com/images/favicon.ico',
  doubao: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/logo.png',
  wolai: 'https://favicon.im/www.wolai.com?larger=true',
  jsonformatter: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/json.png',
  'volcengine-datafinder': 'https://portal.volccdn.com/obj/volcfe/misc/favicon.png',
}

function apexDomain(host) {
  const parts = host.split('.').filter(Boolean)
  if (parts.length <= 2) return host
  return parts.slice(-2).join('.')
}

function candidatesFor(item) {
  const list = []
  if (OVERRIDES[item.id]) list.push(OVERRIDES[item.id])
  if (item.iconUrl && /^https?:\/\//.test(item.iconUrl)) list.push(item.iconUrl)

  try {
    const host = new URL(item.url).hostname.replace(/^www\./, '')
    const apex = apexDomain(host)
    const hosts = host === apex ? [host] : [host, apex]
    for (const h of hosts) {
      list.push(`https://${h}/favicon.ico`, `https://www.${h}/favicon.ico`)
    }
    for (const h of hosts) {
      list.push(`https://icons.duckduckgo.com/ip3/${h}.ico`)
    }
  }
  catch {
    // ignore
  }
  return [...new Set(list)]
}

function extFrom(contentType, url) {
  const type = (contentType || '').toLowerCase()
  if (type.includes('svg')) return 'svg'
  if (type.includes('png')) return 'png'
  if (type.includes('webp')) return 'webp'
  if (type.includes('gif')) return 'gif'
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg'
  if (type.includes('icon') || type.includes('x-icon')) return 'ico'
  const pathname = (() => {
    try { return new URL(url).pathname } catch { return '' }
  })()
  const m = pathname.match(/\.(svg|png|webp|gif|jpe?g|ico)(?:$|\?)/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'png'
}

function looksLikeImage(buf) {
  if (!buf || buf.length < MIN_BYTES) return false
  const head = buf.subarray(0, 200).toString('utf8').toLowerCase()
  if (
    head.includes('<!doctype')
    || head.includes('<html')
    || head.includes('<head')
    || head.includes('<center')
  ) {
    return false
  }
  // PNG / JPEG / GIF / ICO / WEBP / SVG
  if (buf[0] === 0x89 && buf[1] === 0x50) return true
  if (buf[0] === 0xff && buf[1] === 0xd8) return true
  if (buf[0] === 0x47 && buf[1] === 0x49) return true
  if (buf[0] === 0x00 && buf[1] === 0x00 && (buf[2] === 0x01 || buf[2] === 0x02)) return true
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF') return true
  if (head.includes('<svg') || head.includes('<?xml')) return true
  return false
}

async function fetchBytes(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await Promise.race([
      fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS + 200)
      }),
    ])
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (!looksLikeImage(buf)) return null
    return {
      buf,
      ext: extFrom(res.headers.get('content-type'), url),
      source: url,
    }
  }
  catch {
    return null
  }
  finally {
    clearTimeout(timer)
  }
}

async function scanLocalIcons() {
  const map = {}
  try {
    const files = await readdir(outDir)
    for (const file of files) {
      const m = file.match(/^(.+)\.(svg|png|webp|gif|jpe?g|ico)$/i)
      if (!m) continue
      const full = path.join(outDir, file)
      const buf = await readFile(full)
      if (!looksLikeImage(buf)) {
        await unlink(full)
        console.log(`removed invalid local icon: ${file}`)
        continue
      }
      map[m[1]] = `/icons/sites/${file}`
    }
  }
  catch {
    // empty
  }
  return map
}

async function downloadItem(item, localMap) {
  if (localMap[item.id]) {
    return { id: item.id, path: localMap[item.id], source: 'cached', bytes: 0 }
  }

  for (const url of candidatesFor(item)) {
    const result = await fetchBytes(url)
    if (!result) continue
    const filename = `${item.id}.${result.ext}`
    await writeFile(path.join(outDir, filename), result.buf)
    const localPath = `/icons/sites/${filename}`
    localMap[item.id] = localPath
    return { id: item.id, path: localPath, source: result.source, bytes: result.buf.length }
  }
  return null
}

async function main() {
  const raw = await readFile(dataPath, 'utf8')
  const data = JSON.parse(raw)
  await mkdir(outDir, { recursive: true })

  const localMap = await scanLocalIcons()
  const items = data.categories.flatMap(category => category.items)
  // Keep non-navigation local icons (e.g. search engines) when rewriting the manifest.
  const manifest = { ...localMap }
  let ok = 0
  let fail = 0
  let skipped = 0

  for (const item of items) {
    process.stdout.write(`fetch ${item.id} ... `)
    const saved = await downloadItem(item, localMap)
    if (saved) {
      if (saved.source === 'cached') {
        skipped += 1
        console.log(`skip ${saved.path}`)
      }
      else {
        ok += 1
        console.log(`ok (${saved.bytes}B) <- ${saved.source}`)
      }
      manifest[item.id] = saved.path
      item.iconUrl = saved.path
    }
    else {
      fail += 1
      console.log('FAIL')
    }
  }

  const sortedManifest = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  )
  await writeFile(manifestPath, `${JSON.stringify(sortedManifest, null, 2)}\n`)
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`)

  console.log(`\nDone. ok=${ok} cached=${skipped} fail=${fail}`)
  console.log(`Icons: ${outDir}`)
  console.log(`Manifest: ${manifestPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
