import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Skill } from '../types/skill'
import { searchSkills } from '../api/skills'
import { SearchInput } from '../components/ui/SearchInput'
import { SkillGrid } from '../components/skills/SkillGrid'
import { Toast } from '../components/ui/Toast'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [skills, setSkills] = useState<Skill[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (query) {
      setLoading(true)
      searchSkills(query).then((res) => {
        setSkills(res.data)
        setTotal(res.total)
        setLoading(false)
      })
    }
  }, [query])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="max-w-xl mb-8">
        <SearchInput defaultValue={query} large placeholder="搜索 AI 技能..." />
      </div>

      {query && (
        <p className="text-sm text-gray-500 mb-6">
          搜索 "{query}" 共找到 {total} 个结果
        </p>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">搜索中...</div>
      ) : (
        <SkillGrid skills={skills} onCopySuccess={() => setToastVisible(true)} />
      )}

      <Toast
        message="已复制，去 ChatGPT / Claude / Gemini 粘贴使用吧"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  )
}
