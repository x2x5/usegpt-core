import type { Env } from '../../env'
import { getSessionToken, clearSessionCookie } from '../../env'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const token = getSessionToken(context.request)

  if (token) {
    await context.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run()
  }

  return Response.json({ success: true }, {
    headers: { 'Set-Cookie': clearSessionCookie() },
  })
}
