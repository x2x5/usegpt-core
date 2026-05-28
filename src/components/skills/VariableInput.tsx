import type { Variable } from '../../types/skill'

interface VariableInputProps {
  variables: Variable[]
  values: Record<string, string>
  onChange: (name: string, value: string) => void
}

export function VariableInput({ variables, values, onChange }: VariableInputProps) {
  if (variables.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">填写变量</h3>
      {variables.map((v) => (
        <div key={v.name}>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {v.label || v.name}
          </label>
          <textarea
            value={values[v.name] || v.defaultValue || ''}
            onChange={(e) => onChange(v.name, e.target.value)}
            placeholder={v.placeholder || `请输入${v.name}`}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>
      ))}
    </div>
  )
}
