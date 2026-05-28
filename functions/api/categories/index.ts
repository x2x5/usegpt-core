import type { Env } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context

  const rows = await env.DB.prepare(
    'SELECT * FROM categories ORDER BY sort_order ASC'
  ).all()

  return Response.json(rows.results)
}
