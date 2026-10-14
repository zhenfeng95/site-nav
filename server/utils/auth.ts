import type { H3Event } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie } from 'h3'

const COOKIE_NAME = 'wf_admin_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getSecrets(event: H3Event): { password: string; secret: string } {
  const config = useRuntimeConfig(event)
  const password = String(config.adminPassword || '')
  const secret = String(config.adminSessionSecret || password || 'dev-only-secret')

  if (!password) {
    throw createError({
      statusCode: 503,
      message: 'Admin password is not configured (NUXT_ADMIN_PASSWORD).',
    })
  }

  return { password, secret }
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function buildToken(secret: string, expiresAt: number): string {
  const payload = `admin:${expiresAt}`
  return `${payload}.${sign(payload, secret)}`
}

function verifyToken(token: string, secret: string): boolean {
  const lastDot = token.lastIndexOf('.')
  if (lastDot <= 0) {
    return false
  }

  const payload = token.slice(0, lastDot)
  const signature = token.slice(lastDot + 1)
  const expected = sign(payload, secret)

  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return false
    }
  }
  catch {
    return false
  }

  const [, expiresRaw] = payload.split(':')
  const expiresAt = Number(expiresRaw)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false
  }

  return true
}

export function isAdminAuthenticated(event: H3Event): boolean {
  try {
    const { secret } = getSecrets(event)
    const token = getCookie(event, COOKIE_NAME)
    return Boolean(token && verifyToken(token, secret))
  }
  catch {
    return false
  }
}

export function requireAdmin(event: H3Event): void {
  if (!isAdminAuthenticated(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: '请先登录管理后台。',
    })
  }
}

export function loginAdmin(event: H3Event, password: string): void {
  const { password: expected, secret } = getSecrets(event)

  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw createError({
      statusCode: 401,
      message: '密码错误。',
    })
  }

  const expiresAt = Date.now() + SESSION_TTL_MS
  setCookie(event, COOKIE_NAME, buildToken(secret, expiresAt), {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
}

export function logoutAdmin(event: H3Event): void {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}
