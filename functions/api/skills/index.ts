import type { Env } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
  const sort = url.searchParams.get('sort') || 'latest'
  const categoryId = url.searchParams.get('category')
  const offset = (page - 1) * pageSize

  let query = 'SELECT s.*, c.name as category_name FROM skills s LEFT JOIN categories c ON s.category_id = c.id WHERE s.status = ?'
  const params: unknown[] = ['approved']

  if (categoryId) {
    query += ' AND s.category_id = ?'
    params.push(parseInt(categoryId))
  }

  switch (sort) {
    case 'popular':
      query += ' ORDER BY (s.like_count + s.favorite_count + s.copy_count) DESC'
      break
    case 'most_liked':
      query += ' ORDER BY s.like_count DESC'
      break
    case 'most_copied':
      query += ' ORDER BY s.copy_count DESC'
      break
    case 'most_commented':
      query += ' ORDER BY s.comment_count DESC'
      break
    default:
      query += ' ORDER BY s.created_at DESC'
  }

  const countQuery = 'SELECT COUNT(*) as total FROM skills s WHERE s.status = ?' +
    (categoryId ? ' AND s.category_id = ?' : '')
  const countParams = categoryId ? ['approved', parseInt(categoryId)] : ['approved']

  const [rows, countResult] = await Promise.all([
    env.DB.prepare(query + ' LIMIT ? OFFSET ?')
      .bind(...params, pageSize, offset)
      .all(),
    env.DB.prepare(countQuery)
      .bind(...countParams)
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
