import type { Env } from '../../env'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, params } = context
  const id = params.id as string

  await env.DB.prepare(
    'UPDATE skills SET copy_count = copy_count + 1 WHERE id = ?'
  )
    .bind(id)
    .run()

  return Response.json({ success: true })
}
