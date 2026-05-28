import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reactToSkill } from '../../api/skills'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  skillId: number
  likeCount: number
  dislikeCount: number
  userReaction: string | null
  onReactionChange?: () => void
}

export function LikeDislikeButton({ skillId, likeCount, dislikeCount, userReaction: initialReaction, onReactionChange }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userReaction, setUserReaction] = useState(initialReaction)
  const [likes, setLikes] = useState(likeCount)
  const [dislikes, setDislikes] = useState(dislikeCount)
  const [loading, setLoading] = useState(false)

  const handleReact = async (type: 'like' | 'dislike') => {
    if (!user) {
      navigate('/login')
      return
    }
    if (loading) return

    setLoading(true)
    try {
      const res = await reactToSkill(skillId, type)
      const newReaction = res.reaction

      // Update counts based on state change
      if (userReaction === type) {
        // Toggled off
        if (type === 'like') setLikes(l => l - 1)
        else setDislikes(d => d - 1)
      } else if (userReaction === null) {
        // New reaction
        if (type === 'like') setLikes(l => l + 1)
        else setDislikes(d => d + 1)
      } else {
        // Switched reaction
        if (type === 'like') {
          setLikes(l => l + 1)
          setDislikes(d => d - 1)
        } else {
          setLikes(l => l - 1)
          setDislikes(d => d + 1)
        }
      }

      setUserReaction(newReaction)
      onReactionChange?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleReact('like')}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          userReaction === 'like'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
        }`}
      >
        <span>👍</span>
        <span>{likes}</span>
      </button>
      <button
        onClick={() => handleReact('dislike')}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          userReaction === 'dislike'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
        }`}
      >
        <span>👎</span>
        <span>{dislikes}</span>
      </button>
    </div>
  )
}
