import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Skill, Category } from '../types/skill'
import { getTrendingSkills, getLatestSkills, getCategories } from '../api/skills'
import { SearchInput } from '../components/ui/SearchInput'
import { SkillGrid } from '../components/skills/SkillGrid'
import { Toast } from '../components/ui/Toast'

export function HomePage() {
  const [trending, setTrending] = useState<Skill[]>([])
  const [latest, setLatest] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    getTrendingSkills().then(setTrending)
    getLatestSkills().then(setLatest)
    getCategories().then(setCategories)
  }, [])

  const handleCopySuccess = () => setToastVisible(true)

  const hotKeywords = ['小红书', '周报', '翻译', '简历', '编程', 'Midjourney', 'Python', '英文邮件']

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            发现更好用的{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              AI 技能
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            复制即用，让 ChatGPT、Claude、Gemini 更懂你。
          </p>
          <div className="max-w-xl mx-auto mb-6">
            <SearchInput
              large
              placeholder="搜索小红书、周报、翻译、简历、编程、Midjourney..."
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {hotKeywords.map((kw) => (
              <Link
                key={kw}
                to={`/search?q=${encodeURIComponent(kw)}`}
                className="px-4 py-2 text-sm bg-white rounded-full border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🔥 今日热门</h2>
            <p className="text-sm text-gray-500 mt-1">大家都在用的 AI 技能</p>
          </div>
          <Link to="/skills?sort=popular" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            查看更多 →
          </Link>
        </div>
        <SkillGrid skills={trending} onCopySuccess={handleCopySuccess} />
      </section>

      {/* Latest */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">✨ 最新发布</h2>
            <p className="text-sm text-gray-500 mt-1">新鲜出炉的 AI 技能</p>
          </div>
          <Link to="/skills?sort=latest" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            查看更多 →
          </Link>
        </div>
        <SkillGrid skills={latest} onCopySuccess={handleCopySuccess} />
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">📂 精选分类</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/skills?category=${cat.id}`}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
            >
              <span className="text-2xl">{cat.icon || '📦'}</span>
              <span className="font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">分享你的 AI 技能</h2>
          <p className="text-purple-100 mb-8 max-w-md mx-auto">
            把你验证过的好用提示词分享给更多人，帮助大家更高效地使用 AI。
          </p>
          <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            发布技能
          </button>
        </div>
      </section>

      <Toast
        message="已复制，去 ChatGPT / Claude / Gemini 粘贴使用吧"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  )
}
