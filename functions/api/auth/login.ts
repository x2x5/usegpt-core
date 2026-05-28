import type { Env } from '../../env'

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json() as { username?: string; password?: string }
  const username = body.username?.trim().toLowerCase()
  const password = body.password || ''

  if (!username || !password) {
    return Response.json({ error: '请输入用户名和密码' }, { status: 400 })
  }

  const db = context.env.DB

  const user = await db.prepare(
    'SELECT id, username, password_hash, display_name, avatar_url, bio FROM users WHERE username = ?'
  ).bind(username).first<{ id: number; username: string; password_hash: string | null; display_name: string | null; avatar_url: string | null; bio: string | null }>()

  if (!user || !user.password_hash) {
    return Response.json({ error: '用户名或密码错误' }, { status: 401 })
  }

  // Verify password
  const [salt, storedHash] = user.password_hash.split(':')
  const hash = await hashPassword(password, salt)

  if (hash !== storedHash) {
    return Response.json({ error: '用户名或密码错误' }, { status: 401 })
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
