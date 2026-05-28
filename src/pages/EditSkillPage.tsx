import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Category, Variable } from '../types/skill'
import { getSkill, updateSkill, getCategories } from '../api/skills'
import { useAuth } from '../hooks/useAuth'

export function EditSkillPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [promptContent, setPromptContent] = useState('')
  const [keywords, setKeywords] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [suitableModels, setSuitableModels] = useState('')
  const [usageInstructions, setUsageInstructions] = useState('')
  const [exampleInput, setExampleInput] = useState('')
  const [exampleOutput, setExampleOutput] = useState('')
  const [variables, setVariables] = useState<Variable[]>([])

  useEffect(() => {
    if (!id) return
    Promise.all([
      getSkill(Number(id)),
      getCategories(),
    ]).then(([skill, cats]) => {
      if (user && skill.userId !== user.id) {
        navigate('/')
        return
      }
      setTitle(skill.title)
      setDescription(skill.description || '')
      setPromptContent(skill.promptContent)
      setKeywords(skill.keywords.join(', '))
      setCategoryId(skill.categoryId ? String(skill.categoryId) : '')
      setSuitableModels(skill.suitableModels.join(', '))
      setUsageInstructions(skill.usageInstructions || '')
      setExampleInput(skill.exampleInput || '')
      setExampleOutput(skill.exampleOutput || '')
      setVariables(skill.variables)
      setCategories(cats)
    }).finally(() => setLoading(false))
  }, [id, user, navigate])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !title.trim() || !promptContent.trim() || submitting) return

    setSubmitting(true)
    try {
      await updateSkill(Number(id), {
        title: title.trim(),
        description: description.trim() || undefined,
        promptContent: promptContent.trim(),
        keywords: keywords.split(/[,，]/).map(k => k.trim()).filter(Boolean),
        categoryId: categoryId ? Number(categoryId) : undefined,
        suitableModels: suitableModels.split(/[,，]/).map(m => m.trim()).filter(Boolean),
        usageInstructions: usageInstructions.trim() || undefined,
        exampleInput: exampleInput.trim() || undefined,
        exampleOutput: exampleOutput.trim() || undefined,
        variables: variables.length > 0 ? variables : undefined,
      })
      navigate(`/skills/${id}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return <div className="text-center py-16 text-gray-500">加载中...</div>
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">编辑技能</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">选择分类</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prompt 内容 *</label>
          <textarea
            value={promptContent}
            onChange={e => setPromptContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">关键词</label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">适用模型</label>
          <input
            type="text"
            value={suitableModels}
            onChange={e => setSuitableModels(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">使用说明</label>
          <textarea
            value={usageInstructions}
            onChange={e => setUsageInstructions(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">示例输入</label>
            <textarea
              value={exampleInput}
              onChange={e => setExampleInput(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">示例输出</label>
            <textarea
              value={exampleOutput}
              onChange={e => setExampleOutput(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !promptContent.trim() || submitting}
            className="flex-1 py-3 text-base font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '保存中...' : '保存修改'}
          </button>
        </div>
      </form>
    </div>
  )
}
