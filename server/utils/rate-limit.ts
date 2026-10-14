import type { H3Event } from 'h3'
import { getRequestIP } from 'h3'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/**
 * Simple in-isolate rate limit. Good enough for a small nav site;
 * resets when the Worker isolate is recycled.
 */
export function assertRateLimit(
  event: H3Event,
  key: string,
  limit: number,
  windowMs: number,
): void {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const bucketKey = `${key}:${ip}`
  const now = Date.now()
  const current = buckets.get(bucketKey)

  if (!current || now >= current.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return
  }

  current.count += 1
  if (current.count > limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: '提交过于频繁，请稍后再试。',
    })
  }
}
