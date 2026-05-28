import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { sendLoginEmail } from '../api/skills'

export function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  if (user) {
    navigate(-1)
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      await sendLoginEmail(email.trim())
      setSent(true)
    } catch {
      setError('发送失败，请检查邮箱或稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">查看你的邮箱</h1>
          <p className="text-gray-500 mb-6">
            登录链接已发送到 <strong>{email}</strong>，<br />点击邮件中的链接即可登录。
          </p>
          <p className="text-sm text-gray-400">链接 15 分钟内有效</p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="mt-6 text-sm text-purple-600 hover:text-purple-700"
          >
            使用其他邮箱
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">登录 UseGPT</h1>
        <p className="text-gray-500 text-center mb-6">输入邮箱，我们会发送登录链接给你</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoFocus
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="w-full py-3 text-base font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '发送中...' : '发送登录链接'}
          </button>
        </form>
      </div>
    </div>
  )
}
