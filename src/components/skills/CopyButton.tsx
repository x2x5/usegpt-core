import { copyToClipboard } from '../../utils/clipboard'
import { trackCopy } from '../../api/skills'

interface CopyButtonProps {
  text: string
  skillId?: number
  onCopy: () => void
  large?: boolean
}

export function CopyButton({ text, skillId, onCopy, large }: CopyButtonProps) {
  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      if (skillId) trackCopy(skillId)
      onCopy()
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all active:scale-95 ${
        large
          ? 'px-8 py-3 text-base bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
          : 'px-4 py-2 text-sm bg-purple-50 text-purple-600 hover:bg-purple-100'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      复制
    </button>
  )
}
