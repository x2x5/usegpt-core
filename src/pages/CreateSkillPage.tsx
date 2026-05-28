import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Category, Variable } from '../types/skill'
import { createSkill, getCategories } from '../api/skills'
import { useAuth } from '../hooks/useAuth'

export function CreateSkillPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
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
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  // Auto-extract variables from prompt
  useEffect(() => {
    const matches = promptContent.match(/\{\{([^}]+)\}\}/g)
    if (matches) {
      const names = [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '').trim()))]
      setVariables(names.map(name => ({
        name,
        label: name,
        placeholder: `请输入${name}`,
      })))
    }
  }, [promptContent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !promptContent.trim() || submitting) return

    setSubmitting(true)
    try {
      const skill = await createSkill({
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
      navigate(`/skills/${skill.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">发布新技能</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="给你的技能取个名字"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="简要描述这个技能的用途"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt 内容 * <span className="text-gray-400 font-normal">使用 {'{{变量名}}'} 定义模板变量</span>
          </label>
          <textarea
            value={promptContent}
            onChange={e => setPromptContent(e.target.value)}
            placeholder="输入你的 prompt 内容..."
            rows={8}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {variables.length > 0 && (
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm font-medium text-purple-700 mb-2">检测到的模板变量：</p>
            <div className="flex flex-wrap gap-2">
              {variables.map(v => (
                <span key={v.name} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                  {`{{${v.name}}}`}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">关键词</label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="用逗号分隔，如：写作, 营销, 小红书"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">适用模型</label>
          <input
            type="text"
            value={suitableModels}
            onChange={e => setSuitableModels(e.target.value)}
            placeholder="用逗号分隔，如：ChatGPT, Claude, Gemini"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">使用说明</label>
          <textarea
            value={usageInstructions}
            onChange={e => setUsageInstructions(e.target.value)}
            placeholder="说明如何使用这个技能"
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
              placeholder="示例输入"
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">示例输出</label>
            <textarea
              value={exampleOutput}
              onChange={e => setExampleOutput(e.target.value)}
              placeholder="示例输出"
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || !promptContent.trim() || submitting}
          className="w-full py-3 text-base font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '发布中...' : '发布技能'}
        </button>
      </form>
    </div>
  )
}
