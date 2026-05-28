import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Skill } from '../types/skill'
import { getSkill } from '../api/skills'
import { TagBadge } from '../components/ui/TagBadge'
import { CopyButton } from '../components/skills/CopyButton'
import { VariableInput } from '../components/skills/VariableInput'
import { LikeDislikeButton } from '../components/skills/LikeDislikeButton'
import { CommentSection } from '../components/skills/CommentSection'
import { Toast } from '../components/ui/Toast'
import { extractVariables, fillTemplate } from '../utils/template'
import { useAuth } from '../hooks/useAuth'

export function SkillDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [skill, setSkill] = useState<(Skill & { userReaction: string | null }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})

  const fetchSkill = () => {
    if (id) {
      setLoading(true)
      getSkill(Number(id))
        .then((s) => {
          setSkill(s)
          const vars = extractVariables(s.promptContent)
          const defaults: Record<string, string> = {}
          vars.forEach((v) => {
            if (v.defaultValue) defaults[v.name] = v.defaultValue
          })
          setVariableValues(defaults)
        })
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    fetchSkill()
  }, [id])

  if (loading) {
    return <div className="text-center py-20 text-gray-400">加载中...</div>
  }

  if (!skill) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">技能不存在</p>
        <Link to="/skills" className="text-purple-600">返回技能广场</Link>
      </div>
    )
  }

  const variables = extractVariables(skill.promptContent)
  const generatedPrompt = fillTemplate(skill.promptContent, variableValues)
  const allFilled = variables.every((v) => variableValues[v.name]?.trim())

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/skills" className="hover:text-purple-600">技能广场</Link>
        <span>/</span>
        {skill.categoryName && (
          <>
            <Link to={`/skills?category=${skill.categoryId}`} className="hover:text-purple-600">
              {skill.categoryName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700">{skill.title}</span>
      </div>

      {/* Title & meta */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{skill.title}</h1>
      <p className="text-gray-500 text-lg mb-6">{skill.description}</p>

      {/* Tags & models */}
      <div className="flex flex-wrap gap-2 mb-6">
        {skill.keywords.map((kw) => (
          <TagBadge key={kw} label={kw} />
        ))}
      </div>

      {skill.suitableModels.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">适用模型：</span>
          {skill.suitableModels.map((m) => (
            <span key={m} className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full">
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Author & actions */}
      <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-8">
        <div className="flex items-center gap-3">
          {skill.userId ? (
            <Link to={`/user/${skill.userId}`} className="flex items-center gap-3">
              <img
                src={skill.authorAvatarUrl || `https://ui-avatars.com/api/?name=${skill.authorUsername}&background=random`}
                alt={skill.authorUsername || ''}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium text-gray-700 hover:text-purple-600">
                {skill.authorDisplayName || skill.authorUsername || '匿名用户'}
              </span>
            </Link>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <span className="font-medium text-gray-500">匿名用户</span>
            </>
          )}
          {user?.id === skill.userId && (
            <Link
              to={`/skills/${skill.id}/edit`}
              className="ml-2 px-3 py-1 text-xs text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
            >
              编辑
            </Link>
          )}
        </div>
        <LikeDislikeButton
          skillId={skill.id}
          likeCount={skill.likeCount}
          dislikeCount={skill.dislikeCount}
          userReaction={skill.userReaction}
        />
      </div>

      {/* Variable inputs */}
      {variables.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <VariableInput
            variables={variables}
            values={variableValues}
            onChange={handleVariableChange}
          />
        </div>
      )}

      {/* Generated prompt preview */}
      {variables.length > 0 && allFilled && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">生成的提示词</h3>
            <CopyButton
              text={generatedPrompt}
              skillId={skill.id}
              onCopy={() => setToastVisible(true)}
              large
            />
          </div>
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-2xl overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap">
            {generatedPrompt}
          </pre>
        </div>
      )}

      {/* Full prompt */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">完整提示词</h3>
          {variables.length === 0 && (
            <CopyButton
              text={skill.promptContent}
              skillId={skill.id}
              onCopy={() => setToastVisible(true)}
              large
            />
          )}
        </div>
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-2xl overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap">
          {skill.promptContent}
        </pre>
      </div>

      {/* Usage instructions */}
      {skill.usageInstructions && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">使用说明</h3>
          <p className="text-gray-600 leading-relaxed">{skill.usageInstructions}</p>
        </div>
      )}

      {/* Example */}
      {(skill.exampleInput || skill.exampleOutput) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">示例</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skill.exampleInput && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">输入</h4>
                <div className="bg-blue-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                  {skill.exampleInput}
                </div>
              </div>
            )}
            {skill.exampleOutput && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">输出</h4>
                <div className="bg-green-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                  {skill.exampleOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-gray-100 pt-8">
        <CommentSection skillId={skill.id} />
      </div>

      {/* Mobile fixed action bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-4xl mx-auto flex gap-3">
          <LikeDislikeButton
            skillId={skill.id}
            likeCount={skill.likeCount}
            dislikeCount={skill.dislikeCount}
            userReaction={skill.userReaction}
          />
          <CopyButton
            text={variables.length > 0 && allFilled ? generatedPrompt : skill.promptContent}
            skillId={skill.id}
            onCopy={() => setToastVisible(true)}
            large
          />
        </div>
      </div>

      <Toast
        message="已复制，去 ChatGPT / Claude / Gemini 粘贴使用吧"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  )
}
