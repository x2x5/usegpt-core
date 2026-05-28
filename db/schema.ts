import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
})

export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  promptContent: text('prompt_content').notNull(),
  keywords: text('keywords'), // JSON array
  categoryId: integer('category_id').references(() => categories.id),
  authorName: text('author_name').default('Anonymous'),
  authorAvatar: text('author_avatar'),
  suitableModels: text('suitable_models'), // JSON array
  usageInstructions: text('usage_instructions'),
  exampleInput: text('example_input'),
  exampleOutput: text('example_output'),
  variables: text('variables'), // JSON array of variable definitions
  likeCount: integer('like_count').default(0),
  favoriteCount: integer('favorite_count').default(0),
  commentCount: integer('comment_count').default(0),
  copyCount: integer('copy_count').default(0),
  status: text('status').default('approved'),
  createdAt: text('created_at').default("datetime('now')"),
  updatedAt: text('updated_at').default("datetime('now')"),
})
