import type { H3Event } from 'h3'

/** Minimal D1 surface used by this app (avoids hard dep on workers-types). */
export interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement
  first: <T = unknown>() => Promise<T | null>
  run: () => Promise<unknown>
  all: <T = unknown>() => Promise<{ results?: T[] }>
}

export interface D1Database {
  prepare: (query: string) => D1PreparedStatement
}

export function useD1(event: H3Event): D1Database {
  const cloudflare = event.context.cloudflare as { env?: { DB?: D1Database } } | undefined
  const db = cloudflare?.env?.DB

  if (!db) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database unavailable',
      message: 'D1 binding DB is not configured.',
    })
  }

  return db
}
