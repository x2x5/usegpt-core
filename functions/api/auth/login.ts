import type { Env } from '../../env'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json() as { username?: string }
  const username = body.username?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')

  if (!username || username.length < 2 || username.length > 20) {
    return Response.json({ error: '用户名需要 2-20 个字符，只能包含字母、数字、下划线、连字符' }, { status: 400 })
  }

  const db = context.env.DB

  // Find or create user
  let user = await db.prepare(
    'SELECT id, username, display_name, avatar_url, bio FROM users WHERE username = ?'
  ).bind(username).first<{ id: number; username: string; display_name: string | null; avatar_url: string | null; bio: string | null }>()

  if (!user) {
    const result = await db.prepare(
      'INSERT INTO users (github_id, username, avatar_url) VALUES (?, ?, ?)'
    ).bind(`local_${username}`, username, `https://ui-avatars.com/api/?name=${username}&background=random`).run()

    user = {
      id: result.meta.last_row_id as number,
      username,
      display_name: null,
      avatar_url: `https://ui-avatars.com/api/?name=${username}&background=random`,
      bio: null,
    }
  }

  // Create session
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, user.id, expiresAt).run()

  return Response.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
    },
  }, {
    headers: {
      'Set-Cookie': `session_token=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`,
    },
  })
}
