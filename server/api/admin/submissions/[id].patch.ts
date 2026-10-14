import type { SubmissionStatus } from '~/types/submission'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: '缺少申请 ID。' })
  }

  const body = await readBody<{ status?: SubmissionStatus; note?: string }>(event)
  const status = parseStatus(body?.status)
  const note = String(body?.note ?? '')

  const db = useD1(event)
  const item = await updateSubmissionStatus(db, id, status, note)

  return { ok: true, item }
})
