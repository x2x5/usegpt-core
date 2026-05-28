import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { UserProfile, Skill, PaginatedResponse } from '../types/skill'
import { getUserProfile, getUserSkills } from '../api/skills'
import { SkillGrid } from '../components/skills/SkillGrid'

export function UserProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [skills, setSkills] = useState<PaginatedResponse<Skill> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      getUserProfile(Number(id)),
      getUserSkills(Number(id), page),
    ]).then(([p, s]) => {
      setProfile(p)
      setSkills(s)
    }).finally(() => setLoading(false))
  }, [id, page])

  if (loading) {
    return <div className="text-center py-16 text-gray-500">加载中...</div>
  }

  if (!profile) {
    return <div className="text-center py-16 text-gray-500">用户不存在</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-start gap-6 mb-8">
        <img
          src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.username}&background=random&size=128`}
          alt={profile.username}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.displayName || profile.username}
          </h1>
          <p className="text-gray-500">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-2 text-gray-700">{profile.bio}</p>
          )}
          <div className="flex gap-6 mt-3 text-sm text-gray-500">
            <span><strong className="text-gray-900">{profile.stats.skillCount}</strong> 个技能</span>
            <span><strong className="text-gray-900">{profile.stats.totalLikes}</strong> 次点赞</span>
          </div>
        </div>
      </div>

      {/* User's skills */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">发布的技能</h2>
      {skills && (
        <>
          {skills.data.length === 0 ? (
            <div className="text-center py-16 text-gray-500">暂无技能</div>
          ) : (
            <>
              <SkillGrid skills={skills.data} onCopySuccess={() => {}} />

              {skills.total > skills.pageSize && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.ceil(skills.total / skills.pageSize) }, (_, i) => (
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
          )}
        </>
      )}
    </div>
  )
}
