import { useState, useEffect } from 'react'
import type { Skill, PaginatedResponse } from '../types/skill'
import { getRanking } from '../api/skills'
import { SkillGrid } from '../components/skills/SkillGrid'

type RankingType = 'positive' | 'negative'

export function RankingPage() {
  const [type, setType] = useState<RankingType>('positive')
  const [data, setData] = useState<PaginatedResponse<Skill> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getRanking(type, page)
      .then(setData)
      .finally(() => setLoading(false))
  }, [type, page])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">排行榜</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setType('positive'); setPage(1) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            type === 'positive'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50'
          }`}
        >
          👍 正向排行（最多点赞）
        </button>
        <button
          onClick={() => { setType('negative'); setPage(1) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            type === 'negative'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-red-50'
          }`}
        >
          👎 反向排行（最多踩）
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">加载中...</div>
      ) : data ? (
        <>
          <SkillGrid skills={data.data} onCopySuccess={() => {}} />

          {data.total > data.pageSize && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(data.total / data.pageSize) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
