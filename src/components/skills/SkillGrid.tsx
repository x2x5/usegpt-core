import type { Skill } from '../../types/skill'
import { SkillCard } from './SkillCard'

interface SkillGridProps {
  skills: Skill[]
  onCopySuccess: () => void
}

export function SkillGrid({ skills, onCopySuccess }: SkillGridProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg mb-2">暂无技能</p>
        <p className="text-sm">换个关键词试试？</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} onCopySuccess={onCopySuccess} />
      ))}
    </div>
  )
}
