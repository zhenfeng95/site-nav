import type { H3Event } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie } from 'h3'

const COOKIE_NAME = 'wf_captcha'
const TTL_MS = 10 * 60 * 1000

function secret(event: H3Event): string {
  const config = useRuntimeConfig(event)
  return String(config.adminSessionSecret || config.adminPassword || 'dev-captcha-secret')
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url')
}

export function issueCaptcha(event: H3Event): { question: string; svg: string } {
  const a = 1 + Math.floor(Math.random() * 9)
  const b = 1 + Math.floor(Math.random() * 9)
  const answer = String(a + b)
  const expiresAt = Date.now() + TTL_MS
  const payload = `${answer}:${expiresAt}`
  const token = `${payload}.${sign(payload, secret(event))}`

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(TTL_MS / 1000),
  })

  const question = `${a} + ${b} = ?`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
  <rect width="120" height="40" rx="6" fill="#f4f4f5"/>
  <text x="60" y="26" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="18" font-weight="600" fill="#27272a">${a} + ${b}</text>
</svg>`

  return { question, svg }
}

export function verifyCaptcha(event: H3Event, answer: string): void {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) {
    throw createError({ statusCode: 400, message: '验证码已失效，请刷新后重试。' })
  }

  const lastDot = token.lastIndexOf('.')
  if (lastDot <= 0) {
    throw createError({ statusCode: 400, message: '验证码无效，请刷新后重试。' })
  }

  const payload = token.slice(0, lastDot)
  const signature = token.slice(lastDot + 1)
  const expected = sign(payload, secret(event))

  try {
    const left = Buffer.from(signature)
    const right = Buffer.from(expected)
    if (left.length !== right.length || !timingSafeEqual(left, right)) {
      throw new Error('bad sig')
    }
  }
  catch {
    throw createError({ statusCode: 400, message: '验证码无效，请刷新后重试。' })
  }

  const [expectedAnswer, expiresRaw] = payload.split(':')
  const expiresAt = Number(expiresRaw)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    throw createError({ statusCode: 400, message: '验证码已过期，请刷新后重试。' })
  }

  if (String(answer).trim() !== expectedAnswer) {
    throw createError({ statusCode: 400, message: '验证码错误。' })
  }

  deleteCookie(event, COOKIE_NAME, { path: '/' })
}
