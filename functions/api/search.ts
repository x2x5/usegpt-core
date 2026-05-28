import type { Env } from '../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)
  const q = url.searchParams.get('q')?.trim() || ''
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
  const offset = (page - 1) * pageSize

  if (!q) {
    return Response.json({ data: [], total: 0, page, pageSize })
  }

  const likeParam = `%${q}%`

  const [rows, countResult] = await Promise.all([
    env.DB.prepare(
      `SELECT s.*, c.name as category_name FROM skills s
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.status = 'approved' AND (
         s.title LIKE ? OR
         s.description LIKE ? OR
         s.keywords LIKE ? OR
         s.prompt_content LIKE ?
       )
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`
    )
      .bind(likeParam, likeParam, likeParam, likeParam, pageSize, offset)
      .all(),
    env.DB.prepare(
      `SELECT COUNT(*) as total FROM skills s
       WHERE s.status = 'approved' AND (
         s.title LIKE ? OR
         s.description LIKE ? OR
         s.keywords LIKE ? OR
         s.prompt_content LIKE ?
       )`
    )
      .bind(likeParam, likeParam, likeParam, likeParam)
      .first(),
  ])

  return Response.json({
    data: rows.results?.map(mapSkill),
    total: (countResult as { total: number })?.total || 0,
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
