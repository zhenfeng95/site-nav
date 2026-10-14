import type { SubmissionCreateInput } from '~/types/submission'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'submit', 5, 60 * 60 * 1000)

  const body = await readBody<Partial<SubmissionCreateInput>>(event)
  verifyCaptcha(event, String(body?.captcha ?? ''))
  const input = parseCreateInput(body ?? {})
  const db = useD1(event)
  const submission = await insertSubmission(db, input)

  setResponseStatus(event, 201)
  return {
    ok: true,
    id: submission.id,
    message: '提交成功，我们会尽快审核。',
  }
})
