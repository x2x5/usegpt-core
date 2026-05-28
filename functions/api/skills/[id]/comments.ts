import type { Env } from '../../../env'
import { getCurrentUser } from '../../../env'

interface CommentRow {
  id: number
  skill_id: number
  content: string
  created_at: string
  user_id: number
  username: string
  display_name: string | null
  avatar_url: string | null
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const skillId = Number(context.params.id)
  const db = context.env.DB

  const rows = await db.prepare(
    `SELECT c.id, c.skill_id, c.content, c.created_at,
            u.id as user_id, u.username, u.display_name, u.avatar_url
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.skill_id = ?
     ORDER BY c.created_at DESC`
  ).bind(skillId).all<CommentRow>()

  return Response.json({
    data: rows.results.map(r => ({
      id: r.id,
      skillId: r.skill_id,
      content: r.content,
      createdAt: r.created_at,
      user: {
        id: r.user_id,
        username: r.username,
        displayName: r.display_name,
        avatarUrl: r.avatar_url,
      },
    })),
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)
  if (!user) {
    return Response.json({ error: 'Login required' }, { status: 401 })
  }

  const skillId = Number(context.params.id)
  const body = await context.request.json() as { content?: string }
  const content = body.content?.trim()

  if (!content) {
    return Response.json({ error: 'Content is required' }, { status: 400 })
  }

  const db = context.env.DB

  const result = await db.prepare(
    'INSERT INTO comments (user_id, skill_id, content) VALUES (?, ?, ?)'
  ).bind(user.id, skillId, content).run()

  // Update comment count
  await db.prepare(
    'UPDATE skills SET comment_count = comment_count + 1 WHERE id = ?'
  ).bind(skillId).run()

  return Response.json({
    id: result.meta.last_row_id,
    skillId,
    content,
    createdAt: new Date().toISOString(),
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
    },
  }, { status: 201 })
}
