import type { Variable } from '../types/skill'

export function extractVariables(prompt: string): Variable[] {
  const regex = /\{\{([^}]+)\}\}/g
  const names = new Set<string>()
  const variables: Variable[] = []
  let match

  while ((match = regex.exec(prompt)) !== null) {
    const name = match[1].trim()
    if (!names.has(name)) {
      names.add(name)
      variables.push({ name, label: name, placeholder: `请输入${name}` })
    }
  }

  return variables
}

export function fillTemplate(prompt: string, values: Record<string, string>): string {
  return prompt.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    const key = name.trim()
    return values[key] ?? `{{${key}}}`
  })
}
