import type { Env } from '../../env'
import { getCurrentUser } from '../../env'

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)
  if (!user) {
    return Response.json({ error: 'Login required' }, { status: 401 })
  }

  const commentId = Number(context.params.id)
  const db = context.env.DB

  const comment = await db.prepare(
    'SELECT id, skill_id, user_id FROM comments WHERE id = ?'
  ).bind(commentId).first<{ id: number; skill_id: number; user_id: number }>()

  if (!comment) {
    return Response.json({ error: 'Comment not found' }, { status: 404 })
  }

  if (comment.user_id !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run()

  // Update comment count
  await db.prepare(
    'UPDATE skills SET comment_count = MAX(0, comment_count - 1) WHERE id = ?'
  ).bind(comment.skill_id).run()

  return Response.json({ success: true })
}
