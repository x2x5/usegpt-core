import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Skill, Category, SortOption } from '../types/skill'
import { getSkills, getCategories } from '../api/skills'
import { SkillGrid } from '../components/skills/SkillGrid'
import { Toast } from '../components/ui/Toast'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '最新' },
  { value: 'popular', label: '最热' },
  { value: 'most_liked', label: '最多点赞' },
  { value: 'most_disliked', label: '最多踩' },
  { value: 'most_copied', label: '最多复制' },
  { value: 'most_commented', label: '最多评论' },
]

export function SkillListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)

  const sort = (searchParams.get('sort') as SortOption) || 'latest'
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    getSkills({ sort, category, page, pageSize: 20 }).then((res) => {
      setSkills(res.data)
      setTotal(res.total)
      setLoading(false)
    })
  }, [sort, category, page])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">技能广场</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                sort === opt.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">共 {total} 个技能</p>
          <SkillGrid skills={skills} onCopySuccess={() => setToastVisible(true)} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParam('page', String(p))}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Toast
        message="已复制，去 ChatGPT / Claude / Gemini 粘贴使用吧"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  )
}
