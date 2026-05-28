interface StatCounterProps {
  icon: string
  count: number
}

export function StatCounter({ icon, count }: StatCounterProps) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
      <span>{icon}</span>
      <span>{formatCount(count)}</span>
    </span>
  )
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
