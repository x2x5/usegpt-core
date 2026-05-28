import type { Env } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
  const offset = (page - 1) * pageSize

  const db = context.env.DB

  const [rows, countResult] = await Promise.all([
    db.prepare(
      `SELECT s.*, c.name as category_name, u.username as author_username, u.avatar_url as author_avatar_url, u.display_name as author_display_name
       FROM skills s
       LEFT JOIN categories c ON s.category_id = c.id
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY s.dislike_count DESC
       LIMIT ? OFFSET ?`
    ).bind(pageSize, offset).all(),
    db.prepare('SELECT COUNT(*) as total FROM skills').first<{ total: number }>(),
  ])

  return Response.json({
    data: rows.results.map(mapSkill),
    total: countResult?.total || 0,
    page,
    pageSize,
  })
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
    userId: row.user_id,
    authorUsername: row.author_username,
    authorDisplayName: row.author_display_name,
    authorAvatarUrl: row.author_avatar_url,
    suitableModels: JSON.parse((row.suitable_models as string) || '[]'),
    usageInstructions: row.usage_instructions,
    exampleInput: row.example_input,
    exampleOutput: row.example_output,
    variables: JSON.parse((row.variables as string) || '[]'),
    likeCount: row.like_count,
    dislikeCount: row.dislike_count,
    favoriteCount: row.favorite_count,
    commentCount: row.comment_count,
    copyCount: row.copy_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
