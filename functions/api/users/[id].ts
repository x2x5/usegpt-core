import type { Env } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = Number(context.params.id)
  const db = context.env.DB

  const user = await db.prepare(
    'SELECT id, username, display_name, avatar_url, bio, created_at FROM users WHERE id = ?'
  ).bind(userId).first()

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  const stats = await db.prepare(
    'SELECT COUNT(*) as skill_count, SUM(like_count) as total_likes FROM skills WHERE user_id = ?'
  ).bind(userId).first<{ skill_count: number; total_likes: number }>()

  return Response.json({
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    createdAt: user.created_at,
    stats: {
      skillCount: stats?.skill_count || 0,
      totalLikes: stats?.total_likes || 0,
    },
  })
}
