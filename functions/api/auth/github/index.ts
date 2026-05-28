import type { Env } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context
  const url = new URL(request.url)
  const redirectUri = `${url.origin}/api/auth/github/callback`

  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`

  return Response.redirect(githubUrl, 302)
}
