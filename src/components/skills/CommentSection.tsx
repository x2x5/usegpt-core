import { useState, useEffect } from 'react'
import type { Comment } from '../../types/skill'
import { getComments, addComment, deleteComment } from '../../api/skills'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

interface Props {
  skillId: number
}

export function CommentSection({ skillId }: Props) {
  const { user, login } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getComments(skillId)
      .then(res => setComments(res.data))
      .finally(() => setLoading(false))
  }, [skillId])

  const handleSubmit = async () => {
    if (!user) {
      login()
      return
    }
    if (!content.trim() || submitting) return

    setSubmitting(true)
    try {
      const comment = await addComment(skillId, content.trim())
      setComments(prev => [comment, ...prev])
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteComment(id)
    setComments(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">评论 ({comments.length})</h3>

      {/* Comment form */}
      <div className="flex gap-3">
        {user ? (
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
            alt={user.username}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={user ? '写下你的评论...' : '登录后评论'}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发表
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无评论，来发表第一条吧</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <Link to={`/user/${comment.user.id}`}>
                <img
                  src={comment.user.avatarUrl || `https://ui-avatars.com/api/?name=${comment.user.username}&background=random`}
                  alt={comment.user.username}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/user/${comment.user.id}`} className="text-sm font-medium text-gray-900 hover:text-purple-600">
                    {comment.user.displayName || comment.user.username}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                  {user?.id === comment.user.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-xs text-gray-400 hover:text-red-500"
                    >
                      删除
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
