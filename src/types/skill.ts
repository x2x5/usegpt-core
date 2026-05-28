export interface Skill {
  id: number
  title: string
  description: string | null
  promptContent: string
  keywords: string[]
  categoryId: number | null
  categoryName?: string
  userId: number | null
  authorUsername?: string
  authorDisplayName?: string
  authorAvatarUrl?: string
  suitableModels: string[]
  usageInstructions: string | null
  exampleInput: string | null
  exampleOutput: string | null
  variables: Variable[]
  likeCount: number
  dislikeCount: number
  favoriteCount: number
  commentCount: number
  copyCount: number
  createdAt: string
  updatedAt: string
  userReaction?: string | null
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

export interface User {
  id: number
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
}

export interface UserProfile extends User {
  createdAt: string
  stats: {
    skillCount: number
    totalLikes: number
  }
}

export interface Comment {
  id: number
  skillId: number
  content: string
  createdAt: string
  user: {
    id: number
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type SortOption = 'latest' | 'popular' | 'most_liked' | 'most_disliked' | 'most_copied' | 'most_commented'
