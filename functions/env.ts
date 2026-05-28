export interface Env {
  DB: D1Database
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

export interface User {
  id: number
  github_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}

export function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function getCurrentUser(env: Env, request: Request): Promise<User | null> {
  const token = getSessionToken(request)
  if (!token) return null

  const session = await env.DB.prepare(
    'SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime(\'now\')'
  ).bind(token).first<{ user_id: number }>()

  if (!session) return null

  const user = await env.DB.prepare(
    'SELECT id, github_id, username, display_name, avatar_url, bio FROM users WHERE id = ?'
  ).bind(session.user_id).first<User>()

  return user || null
}

export function setSessionCookie(token: string): string {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
  return `session_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires}`
}

export function clearSessionCookie(): string {
  return 'session_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
}
