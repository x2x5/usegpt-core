import type { Env } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return new Response('无效的登录链接', { status: 400 })
  }

  const db = context.env.DB

  // Find and validate token
  const loginToken = await db.prepare(
    'SELECT id, email, expires_at, used FROM login_tokens WHERE id = ?'
  ).bind(token).first<{ id: string; email: string; expires_at: string; used: number }>()

  if (!loginToken) {
    return new Response('登录链接无效', { status: 400 })
  }

  if (loginToken.used) {
    return new Response('此登录链接已使用', { status: 400 })
  }

  if (new Date(loginToken.expires_at) < new Date()) {
    return new Response('登录链接已过期，请重新获取', { status: 400 })
  }

  // Mark token as used
  await db.prepare('UPDATE login_tokens SET used = 1 WHERE id = ?').bind(token).run()

  // Find or create user by email
  let user = await db.prepare(
    'SELECT id, username FROM users WHERE email = ?'
  ).bind(loginToken.email).first<{ id: number; username: string }>()

  if (!user) {
    // Create new user from email
    const username = loginToken.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20) || 'user'
    const uniqueUsername = `${username}_${Date.now().toString(36).slice(-4)}`

    const result = await db.prepare(
      'INSERT INTO users (github_id, username, email, avatar_url) VALUES (?, ?, ?, ?)'
    ).bind(`email_${loginToken.email}`, uniqueUsername, loginToken.email, `https://ui-avatars.com/api/?name=${uniqueUsername}&background=random`).run()

    user = { id: result.meta.last_row_id as number, username: uniqueUsername }
  }

  // Create session
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, user.id, expiresAt).run()

  // Redirect to home with session cookie
  const origin = url.origin
  return new Response(null, {
    status: 302,
    headers: {
      Location: origin,
      'Set-Cookie': `session_token=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`,
    },
  })
}
