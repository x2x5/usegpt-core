import { fetchApi } from './client'
import type { Skill, Category, PaginatedResponse } from '../types/skill'

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

export async function getSkill(id: number): Promise<Skill> {
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
