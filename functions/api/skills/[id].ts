import type { Env } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context
  const id = params.id as string

  const row = await env.DB.prepare(
    'SELECT s.*, c.name as category_name FROM skills s LEFT JOIN categories c ON s.category_id = c.id WHERE s.id = ? AND s.status = ?'
  )
    .bind(id, 'approved')
    .first()

  if (!row) {
    return Response.json({ error: 'Skill not found' }, { status: 404 })
  }

  return Response.json(mapSkill(row as Record<string, unknown>))
}

function mapSkill(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    promptContent: row.prompt_content,
    keywords: JSON.parse((row.keywords as string) || '[]'),
    categoryId: row.category_id,
    categoryName: row.category_name,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    suitableModels: JSON.parse((row.suitable_models as string) || '[]'),
    usageInstructions: row.usage_instructions,
    exampleInput: row.example_input,
    exampleOutput: row.example_output,
    variables: JSON.parse((row.variables as string) || '[]'),
    likeCount: row.like_count,
    favoriteCount: row.favorite_count,
    commentCount: row.comment_count,
    copyCount: row.copy_count,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
