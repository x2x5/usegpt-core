import type { Env } from '../../env'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json() as { email?: string }
  const email = body.email?.trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return Response.json({ error: '请输入有效的邮箱地址' }, { status: 400 })
  }

  const db = context.env.DB
  const url = new URL(context.request.url)
  const origin = url.origin

  // Create login token
  const tokenId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

  await db.prepare(
    'INSERT INTO login_tokens (id, email, expires_at) VALUES (?, ?, ?)'
  ).bind(tokenId, email, expiresAt).run()

  const loginLink = `${origin}/api/auth/verify?token=${tokenId}`

  // Send email via Resend
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'UseGPT <login@usegpt.top>',
        to: [email],
        subject: '登录 UseGPT',
        html: `<div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:40px 20px;">
          <h2 style="color:#7c3aed;">登录 UseGPT</h2>
          <p>点击下方链接登录你的账号：</p>
          <a href="${loginLink}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:12px;margin:16px 0;">登录 UseGPT</a>
          <p style="color:#888;font-size:14px;">链接 15 分钟内有效。如果不是你操作的，请忽略此邮件。</p>
        </div>`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return Response.json({ error: '邮件发送失败，请稍后重试' }, { status: 500 })
    }
  } catch (e) {
    console.error('Email send error:', e)
    return Response.json({ error: '邮件发送失败，请稍后重试' }, { status: 500 })
  }

  return Response.json({ success: true, message: '登录链接已发送到你的邮箱' })
}
