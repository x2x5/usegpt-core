interface TagBadgeProps {
  label: string
  onClick?: () => void
}

export function TagBadge({ label, onClick }: TagBadgeProps) {
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className="inline-block px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors cursor-default"
    >
      #{label}
    </Component>
  )
}
