import type { Env } from '../../env'
import { getCurrentUser } from '../../env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
  const sort = url.searchParams.get('sort') || 'latest'
  const categoryId = url.searchParams.get('category')
  const offset = (page - 1) * pageSize

  let query = `SELECT s.*, c.name as category_name,
    u.username as author_username, u.avatar_url as author_avatar_url, u.display_name as author_display_name
    FROM skills s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN users u ON s.user_id = u.id
    WHERE 1=1`
  const params: unknown[] = []

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
    case 'most_disliked':
      query += ' ORDER BY s.dislike_count DESC'
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

  let countQuery = 'SELECT COUNT(*) as total FROM skills s WHERE 1=1'
  const countParams: unknown[] = []
  if (categoryId) {
    countQuery += ' AND s.category_id = ?'
    countParams.push(parseInt(categoryId))
  }

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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const user = await getCurrentUser(context.env, context.request)
  if (!user) {
    return Response.json({ error: 'Login required' }, { status: 401 })
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

  if (!body.title?.trim() || !body.promptContent?.trim()) {
    return Response.json({ error: 'Title and prompt content are required' }, { status: 400 })
  }

  const db = context.env.DB
  const result = await db.prepare(
    `INSERT INTO skills (title, description, prompt_content, keywords, category_id, user_id,
      suitable_models, usage_instructions, example_input, example_output, variables)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.title.trim(),
    body.description?.trim() || null,
    body.promptContent.trim(),
    JSON.stringify(body.keywords || []),
    body.categoryId || null,
    user.id,
    JSON.stringify(body.suitableModels || []),
    body.usageInstructions?.trim() || null,
    body.exampleInput?.trim() || null,
    body.exampleOutput?.trim() || null,
    JSON.stringify(body.variables || [])
  ).run()

  return Response.json({
    id: result.meta.last_row_id,
    title: body.title.trim(),
    description: body.description?.trim() || null,
    promptContent: body.promptContent.trim(),
    keywords: body.keywords || [],
    categoryId: body.categoryId || null,
    userId: user.id,
    suitableModels: body.suitableModels || [],
    usageInstructions: body.usageInstructions?.trim() || null,
    exampleInput: body.exampleInput?.trim() || null,
    exampleOutput: body.exampleOutput?.trim() || null,
    variables: body.variables || [],
    likeCount: 0,
    dislikeCount: 0,
    favoriteCount: 0,
    commentCount: 0,
    copyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, { status: 201 })
}

export function mapSkill(row: Record<string, unknown>) {
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
