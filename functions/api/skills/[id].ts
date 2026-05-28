import type { Env } from '../../env'
import { getCurrentUser } from '../../env'
import { mapSkill } from './index'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const skillId = context.params.id as string
  const db = context.env.DB

  const row = await db.prepare(
    `SELECT s.*, c.name as category_name,
      u.username as author_username, u.avatar_url as author_avatar_url, u.display_name as author_display_name
     FROM skills s
     LEFT JOIN categories c ON s.category_id = c.id
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.id = ?`
  ).bind(skillId).first()

  if (!row) {
    return Response.json({ error: 'Skill not found' }, { status: 404 })
  }

  // Get current user's reaction if logged in
  let userReaction: string | null = null
  const user = await getCurrentUser(context.env, context.request)
  if (user) {
    const reaction = await db.prepare(
      'SELECT type FROM reactions WHERE user_id = ? AND skill_id = ?'
    ).bind(user.id, Number(skillId)).first<{ type: string }>()
    userReaction = reaction?.type || null
  }

  return Response.json({
    ...mapSkill(row as Record<string, unknown>),
    userReaction,
  })
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)
  if (!user) {
    return Response.json({ error: 'Login required' }, { status: 401 })
  }

  const skillId = Number(context.params.id)
  const db = context.env.DB

  const skill = await db.prepare(
    'SELECT id, user_id FROM skills WHERE id = ?'
  ).bind(skillId).first<{ id: number; user_id: number }>()

  if (!skill) {
    return Response.json({ error: 'Skill not found' }, { status: 404 })
  }

  if (skill.user_id !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await context.request.json() as {
    title?: string
    description?: string
    promptContent?: string
    keywords?: string[]
    categoryId?: number
    suitableModels?: string[]
    usageInstructions?: string
    exampleInput?: string
    exampleOutput?: string
    variables?: Array<{ name: string; label?: string; placeholder?: string; defaultValue?: string }>
  }

  await db.prepare(
    `UPDATE skills SET
      title = COALESCE(?, title),
      description = ?,
      prompt_content = COALESCE(?, prompt_content),
      keywords = COALESCE(?, keywords),
      category_id = ?,
      suitable_models = COALESCE(?, suitable_models),
      usage_instructions = ?,
      example_input = ?,
      example_output = ?,
      variables = COALESCE(?, variables),
      updated_at = datetime('now')
     WHERE id = ?`
  ).bind(
    body.title?.trim() || null,
    body.description !== undefined ? body.description : null,
    body.promptContent?.trim() || null,
    body.keywords ? JSON.stringify(body.keywords) : null,
    body.categoryId !== undefined ? body.categoryId : null,
    body.suitableModels ? JSON.stringify(body.suitableModels) : null,
    body.usageInstructions !== undefined ? body.usageInstructions : null,
    body.exampleInput !== undefined ? body.exampleInput : null,
    body.exampleOutput !== undefined ? body.exampleOutput : null,
    body.variables ? JSON.stringify(body.variables) : null,
    skillId
  ).run()

  return Response.json({ success: true })
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)
  if (!user) {
    return Response.json({ error: 'Login required' }, { status: 401 })
  }

  const skillId = Number(context.params.id)
  const db = context.env.DB

  const skill = await db.prepare(
    'SELECT id, user_id FROM skills WHERE id = ?'
  ).bind(skillId).first<{ id: number; user_id: number }>()

  if (!skill) {
    return Response.json({ error: 'Skill not found' }, { status: 404 })
  }

  if (skill.user_id !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Delete related data first
  await db.prepare('DELETE FROM reactions WHERE skill_id = ?').bind(skillId).run()
  await db.prepare('DELETE FROM comments WHERE skill_id = ?').bind(skillId).run()
  await db.prepare('DELETE FROM skills WHERE id = ?').bind(skillId).run()

  return Response.json({ success: true })
}
