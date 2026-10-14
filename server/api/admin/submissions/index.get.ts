import type { SubmissionStatus } from '~/types/submission'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const statusRaw = typeof query.status === 'string' ? query.status : ''
  const status = statusRaw
    ? parseStatus(statusRaw)
    : undefined

  const db = useD1(event)
  const items = await listSubmissions(db, status as SubmissionStatus | undefined)

  return { items }
})
