import type { Env } from '../../env'
import { getCurrentUser } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)

  if (!user) {
    return Response.json({ user: null })
  }

  return Response.json({ user })
}
