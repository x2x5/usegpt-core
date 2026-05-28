import { Link } from 'react-router-dom'
import type { Skill } from '../../types/skill'
import { TagBadge } from '../ui/TagBadge'
import { StatCounter } from '../ui/StatCounter'
import { CopyButton } from './CopyButton'

interface SkillCardProps {
  skill: Skill
  onCopySuccess: () => void
}

export function SkillCard({ skill, onCopySuccess }: SkillCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-purple-100 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-3">
        <Link to={`/skills/${skill.id}`} className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
            {skill.title}
          </h3>
        </Link>
        {skill.authorAvatarUrl ? (
          <img src={skill.authorAvatarUrl} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-sm flex-shrink-0">
            {(skill.authorUsername || '匿').charAt(0)}
          </div>
        )}
      </div>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{skill.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {skill.keywords.slice(0, 4).map((kw) => (
          <TagBadge key={kw} label={kw} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StatCounter icon="👍" count={skill.likeCount} />
          <StatCounter icon="💬" count={skill.commentCount} />
          <StatCounter icon="⭐" count={skill.favoriteCount} />
          <StatCounter icon="📋" count={skill.copyCount} />
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={skill.promptContent} skillId={skill.id} onCopy={onCopySuccess} />
          <Link
            to={`/skills/${skill.id}`}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            查看全文
          </Link>
        </div>
      </div>
    </div>
  )
}
