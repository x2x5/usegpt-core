import type { Env } from '../../../env'
import { getCurrentUser } from '../../../env'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)
  if (!user) {
    return Response.json({ error: 'Login required' }, { status: 401 })
  }

  const skillId = Number(context.params.id)
  const body = await context.request.json() as { type?: string }
  const type = body.type

  if (type !== 'like' && type !== 'dislike') {
    return Response.json({ error: 'Invalid type, must be like or dislike' }, { status: 400 })
  }

  const db = context.env.DB

  // Check existing reaction
  const existing = await db.prepare(
    'SELECT id, type FROM reactions WHERE user_id = ? AND skill_id = ?'
  ).bind(user.id, skillId).first<{ id: number; type: string }>()

  if (existing) {
    if (existing.type === type) {
      // Same reaction, remove it (toggle off)
      await db.prepare('DELETE FROM reactions WHERE id = ?').bind(existing.id).run()
      await db.prepare(
        `UPDATE skills SET ${type}_count = MAX(0, ${type}_count - 1) WHERE id = ?`
      ).bind(skillId).run()
      return Response.json({ reaction: null })
    } else {
      // Different reaction, switch it
      await db.prepare('UPDATE reactions SET type = ? WHERE id = ?').bind(type, existing.id).run()
      await db.prepare(
        `UPDATE skills SET ${existing.type}_count = MAX(0, ${existing.type}_count - 1), ${type}_count = ${type}_count + 1 WHERE id = ?`
      ).bind(skillId).run()
      return Response.json({ reaction: type })
    }
  }

  // New reaction
  await db.prepare(
    'INSERT INTO reactions (user_id, skill_id, type) VALUES (?, ?, ?)'
  ).bind(user.id, skillId, type).run()

  await db.prepare(
    `UPDATE skills SET ${type}_count = ${type}_count + 1 WHERE id = ?`
  ).bind(skillId).run()

  return Response.json({ reaction: type })
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)
  if (!user) {
    return Response.json({ error: 'Login required' }, { status: 401 })
  }

  const skillId = Number(context.params.id)
  const db = context.env.DB

  const existing = await db.prepare(
    'SELECT id, type FROM reactions WHERE user_id = ? AND skill_id = ?'
  ).bind(user.id, skillId).first<{ id: number; type: string }>()

  if (existing) {
    await db.prepare('DELETE FROM reactions WHERE id = ?').bind(existing.id).run()
    await db.prepare(
      `UPDATE skills SET ${existing.type}_count = MAX(0, ${existing.type}_count - 1) WHERE id = ?`
    ).bind(skillId).run()
  }

  return Response.json({ reaction: null })
}
