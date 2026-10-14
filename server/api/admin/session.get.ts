export default defineEventHandler((event) => {
  return {
    authenticated: isAdminAuthenticated(event),
  }
})
