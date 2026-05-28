import type { Env } from '../../env'

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json() as { username?: string; password?: string }
  const username = body.username?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
  const password = body.password || ''

  if (!username || username.length < 2 || username.length > 20) {
    return Response.json({ error: '用户名需要 2-20 个字符，只能包含字母、数字、下划线' }, { status: 400 })
  }

  if (password.length < 6) {
    return Response.json({ error: '密码至少 6 个字符' }, { status: 400 })
  }

  const db = context.env.DB

  // Check if username exists
  const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first()
  if (existing) {
    return Response.json({ error: '用户名已被占用' }, { status: 409 })
  }

  // Hash password
  const salt = crypto.randomUUID()
  const hash = await hashPassword(password, salt)
  const stored = `${salt}:${hash}`

  // Create user
  const result = await db.prepare(
    'INSERT INTO users (github_id, username, password_hash, avatar_url) VALUES (?, ?, ?, ?)'
  ).bind(`local_${username}`, username, stored, `https://ui-avatars.com/api/?name=${username}&background=random`).run()

  const userId = result.meta.last_row_id as number

  // Create session
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, userId, expiresAt).run()

  return Response.json({
    user: {
      id: userId,
      username,
      displayName: null,
      avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`,
      bio: null,
    },
  }, {
    headers: {
      'Set-Cookie': `session_token=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`,
    },
  })
}
