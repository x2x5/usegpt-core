import type { Env } from '../../env'

interface GitHubUser {
  id: number
  login: string
  name: string | null
  avatar_url: string | null
  bio: string | null
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing code', { status: 400 })
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string }
    if (!tokenData.access_token) {
      return new Response(`GitHub OAuth error: ${tokenData.error}`, { status: 400 })
    }

    // Get user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'UseGPT',
      },
    })

    const ghUser = await userRes.json() as GitHubUser

    // Upsert user
    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE github_id = ?'
    ).bind(String(ghUser.id)).first<{ id: number }>()

    let userId: number
    if (existing) {
      await env.DB.prepare(
        'UPDATE users SET username = ?, display_name = ?, avatar_url = ?, bio = ? WHERE id = ?'
      ).bind(ghUser.login, ghUser.name, ghUser.avatar_url, ghUser.bio, existing.id).run()
      userId = existing.id
    } else {
      const result = await env.DB.prepare(
        'INSERT INTO users (github_id, username, display_name, avatar_url, bio) VALUES (?, ?, ?, ?, ?)'
      ).bind(String(ghUser.id), ghUser.login, ghUser.name, ghUser.avatar_url, ghUser.bio).run()
      userId = result.meta.last_row_id as number
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(sessionId, userId, expiresAt).run()

    // Redirect with session cookie
    const origin = url.origin
    return new Response(null, {
      status: 302,
      headers: {
        Location: origin,
        'Set-Cookie': `session_token=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`,
      },
    })
  } catch (e) {
    return new Response(`Internal error: ${String(e)}`, { status: 500 })
  }
}
