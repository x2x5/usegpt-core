import type { Env } from '../../env'
import { mapSkill } from './index'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB
  const limit = 10

  const rows = await db.prepare(
    `SELECT s.*, c.name as category_name,
      u.username as author_username, u.avatar_url as author_avatar_url, u.display_name as author_display_name
     FROM skills s
     LEFT JOIN categories c ON s.category_id = c.id
     LEFT JOIN users u ON s.user_id = u.id
     ORDER BY s.created_at DESC
     LIMIT ?`
  ).bind(limit).all()

  return Response.json(rows.results?.map(mapSkill))
}
