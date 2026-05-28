export interface Skill {
  id: number
  title: string
  description: string | null
  promptContent: string
  keywords: string[]
  categoryId: number | null
  categoryName?: string
  authorName: string
  authorAvatar: string | null
  suitableModels: string[]
  usageInstructions: string | null
  exampleInput: string | null
  exampleOutput: string | null
  variables: Variable[]
  likeCount: number
  favoriteCount: number
  commentCount: number
  copyCount: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface Variable {
  name: string
  label?: string
  placeholder?: string
  defaultValue?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  sortOrder: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type SortOption = 'latest' | 'popular' | 'most_liked' | 'most_copied' | 'most_commented'
