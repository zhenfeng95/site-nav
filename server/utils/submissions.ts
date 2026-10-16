import type { Submission, SubmissionCreateInput, SubmissionStatus } from '~/types/submission'
import { getNavigationCategories } from '~/utils/navigation'
import type { D1Database } from './db'

const NAME_MAX = 80
const URL_MAX = 500
const DESCRIPTION_MAX = 500
const CONTACT_MAX = 120
/** Data URL length budget for ~1MB binary icons (base64 expands ~4/3). */
const ICON_MAX = 1_400_000
const ICON_DATA_URL_RE = /^data:image\/(png|jpe?g|gif|webp|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,/i
const NOTE_MAX = 500

const ALLOWED_CATEGORIES = new Set(getNavigationCategories().map(c => c.slug))

interface SubmissionRow {
  id: string
  name: string
  url: string
  category: string
  description: string
  contact: string
  icon_url?: string
  status: SubmissionStatus
  note: string
  created_at: string
  updated_at: string
}

export function mapSubmissionRow(row: SubmissionRow): Submission {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    category: row.category,
    description: row.description,
    contact: row.contact,
    iconUrl: row.icon_url ?? '',
    status: row.status,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function trim(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max)
}

export function normalizeUrl(raw: string): string {
  let value = raw.trim()
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`
  }

  let parsed: URL
  try {
    parsed = new URL(value)
  }
  catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL',
      message: '请填写有效的网站地址。',
    })
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL',
      message: '仅支持 http 或 https 链接。',
    })
  }

  return parsed.toString()
}

export function parseCreateInput(body: Partial<SubmissionCreateInput>): {
  name: string
  url: string
  category: string
  description: string
  contact: string
  iconUrl: string
} {
  if (trim(body.website, 200)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: '提交失败，请稍后重试。',
    })
  }

  const name = trim(body.name, NAME_MAX)
  const category = trim(body.category, 64)
  const description = trim(body.description, DESCRIPTION_MAX)
  const contact = trim(body.contact, CONTACT_MAX)
  const iconRaw = trim(body.iconUrl, ICON_MAX)
  const urlRaw = trim(body.url, URL_MAX)

  if (!name) {
    throw createError({ statusCode: 400, message: '请填写网站名称。' })
  }
  if (!urlRaw) {
    throw createError({ statusCode: 400, message: '请填写网站地址。' })
  }
  if (!category || !ALLOWED_CATEGORIES.has(category)) {
    throw createError({ statusCode: 400, message: '请选择有效的分组。' })
  }

  let iconUrl = ''
  if (iconRaw) {
    if (ICON_DATA_URL_RE.test(iconRaw)) {
      if (iconRaw.length > ICON_MAX) {
        throw createError({ statusCode: 400, message: '图标文件过大，请压缩后重试（不超过 1MB）。' })
      }
      iconUrl = iconRaw
    }
    else {
      iconUrl = normalizeUrl(iconRaw)
    }
  }

  return {
    name,
    url: normalizeUrl(urlRaw),
    category,
    description,
    contact,
    iconUrl,
  }
}

export function parseStatus(value: unknown): SubmissionStatus {
  if (value === 'pending' || value === 'approved' || value === 'rejected') {
    return value
  }
  throw createError({ statusCode: 400, message: '无效的状态。' })
}

export async function insertSubmission(
  db: D1Database,
  input: ReturnType<typeof parseCreateInput>,
): Promise<Submission> {
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await db
    .prepare(
      `INSERT INTO submissions
        (id, name, url, category, description, contact, icon_url, status, note, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', '', ?, ?)`,
    )
    .bind(
      id,
      input.name,
      input.url,
      input.category,
      input.description,
      input.contact,
      input.iconUrl,
      now,
      now,
    )
    .run()

  return {
    id,
    ...input,
    status: 'pending',
    note: '',
    createdAt: now,
    updatedAt: now,
  }
}

export async function listSubmissions(
  db: D1Database,
  status?: SubmissionStatus,
): Promise<Submission[]> {
  const result = status
    ? await db
        .prepare(
          `SELECT * FROM submissions WHERE status = ? ORDER BY created_at DESC LIMIT 200`,
        )
        .bind(status)
        .all<SubmissionRow>()
    : await db
        .prepare(`SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200`)
        .all<SubmissionRow>()

  return (result.results ?? []).map(mapSubmissionRow)
}

export async function getSubmission(
  db: D1Database,
  id: string,
): Promise<Submission | null> {
  const row = await db
    .prepare(`SELECT * FROM submissions WHERE id = ?`)
    .bind(id)
    .first<SubmissionRow>()

  return row ? mapSubmissionRow(row) : null
}

export async function updateSubmissionStatus(
  db: D1Database,
  id: string,
  status: SubmissionStatus,
  note: string,
): Promise<Submission> {
  const existing = await getSubmission(db, id)
  if (!existing) {
    throw createError({ statusCode: 404, message: '申请不存在。' })
  }

  const now = new Date().toISOString()
  const safeNote = trim(note, NOTE_MAX)

  await db
    .prepare(
      `UPDATE submissions SET status = ?, note = ?, updated_at = ? WHERE id = ?`,
    )
    .bind(status, safeNote, now, id)
    .run()

  return {
    ...existing,
    status,
    note: safeNote,
    updatedAt: now,
  }
}

export function listCategoryOptions(): Array<{ slug: string; name: string }> {
  return getNavigationCategories().map(c => ({
    slug: c.slug,
    name: c.name,
  }))
}

export function extractTitleAndIcon(html: string, pageUrl: string): { title: string; iconUrl: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch?.[1]?.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX) || ''

  const iconMatch
    = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i)
      || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i)

  let iconUrl = ''
  if (iconMatch?.[1]) {
    try {
      iconUrl = new URL(iconMatch[1], pageUrl).toString()
    }
    catch {
      iconUrl = ''
    }
  }

  if (!iconUrl) {
    try {
      iconUrl = new URL('/favicon.ico', pageUrl).toString()
    }
    catch {
      iconUrl = ''
    }
  }

  return { title, iconUrl }
}
