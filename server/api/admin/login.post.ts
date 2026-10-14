export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'admin-login', 10, 15 * 60 * 1000)

  const body = await readBody<{ password?: string }>(event)
  const password = String(body?.password ?? '')

  if (!password) {
    throw createError({ statusCode: 400, message: '请输入密码。' })
  }

  loginAdmin(event, password)
  return { ok: true }
})
