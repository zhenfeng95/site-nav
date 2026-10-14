export default defineEventHandler(async (event) => {
  logoutAdmin(event)
  return { ok: true }
})
