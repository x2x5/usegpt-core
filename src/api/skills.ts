import { fetchApi } from './client'
import type { Skill, Category, User, UserProfile, Comment, PaginatedResponse } from '../types/skill'

// Skills
export async function getSkills(params: {
  page?: number
  pageSize?: number
  sort?: string
  category?: string
} = {}): Promise<PaginatedResponse<Skill>> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.category) searchParams.set('category', params.category)

  return fetchApi(`/skills?${searchParams}`)
}

export async function getSkill(id: number): Promise<Skill & { userReaction: string | null }> {
  return fetchApi(`/skills/${id}`)
}

export async function getTrendingSkills(): Promise<Skill[]> {
  return fetchApi('/skills/trending')
}

export async function getLatestSkills(): Promise<Skill[]> {
  return fetchApi('/skills/latest')
}

export async function searchSkills(q: string, page = 1): Promise<PaginatedResponse<Skill>> {
  return fetchApi(`/search?q=${encodeURIComponent(q)}&page=${page}`)
}

export async function getCategories(): Promise<Category[]> {
  return fetchApi('/categories')
}

export async function trackCopy(id: number): Promise<void> {
  fetchApi(`/skills/${id}/copy`, { method: 'POST' })
}

export async function createSkill(data: {
  title: string
  description?: string
  promptContent: string
  keywords?: string[]
  categoryId?: number
  suitableModels?: string[]
  usageInstructions?: string
  exampleInput?: string
  exampleOutput?: string
  variables?: Array<{ name: string; label?: string; placeholder?: string; defaultValue?: string }>
}): Promise<Skill> {
  return fetchApi('/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateSkill(id: number, data: Partial<{
  title: string
  description: string
  promptContent: string
  keywords: string[]
  categoryId: number
  suitableModels: string[]
  usageInstructions: string
  exampleInput: string
  exampleOutput: string
  variables: Array<{ name: string; label?: string; placeholder?: string; defaultValue?: string }>
}>): Promise<void> {
  return fetchApi(`/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteSkill(id: number): Promise<void> {
  return fetchApi(`/skills/${id}`, { method: 'DELETE' })
}

// Reactions
export async function reactToSkill(id: number, type: 'like' | 'dislike'): Promise<{ reaction: string | null }> {
  return fetchApi(`/skills/${id}/react`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  })
}

export async function removeReaction(id: number): Promise<void> {
  return fetchApi(`/skills/${id}/react`, { method: 'DELETE' })
}

// Comments
export async function getComments(skillId: number): Promise<{ data: Comment[] }> {
  return fetchApi(`/skills/${skillId}/comments`)
}

export async function addComment(skillId: number, content: string): Promise<Comment> {
  return fetchApi(`/skills/${skillId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function deleteComment(id: number): Promise<void> {
  return fetchApi(`/comments/${id}`, { method: 'DELETE' })
}

// Ranking
export async function getRanking(type: 'positive' | 'negative', page = 1): Promise<PaginatedResponse<Skill>> {
  return fetchApi(`/ranking/${type}?page=${page}`)
}

// Auth
export async function getMe(): Promise<{ user: User | null }> {
  return fetchApi('/auth/me')
}

export async function login(username: string): Promise<{ user: User }> {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username }),
  })
}

export async function logout(): Promise<void> {
  return fetchApi('/auth/logout', { method: 'POST' })
}

// Users
export async function getUserProfile(id: number): Promise<UserProfile> {
  return fetchApi(`/users/${id}`)
}

export async function getUserSkills(id: number, page = 1): Promise<PaginatedResponse<Skill>> {
  return fetchApi(`/users/${id}/skills?page=${page}`)
}
