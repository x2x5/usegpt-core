import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { sendLoginEmail } from '../api/skills'

type Tab = 'login' | 'register' | 'email'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login, register } = useAuth()
  const [tab, setTab] = useState<Tab>('login')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  if (user) {
    navigate(-1)
    return null
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password || loading) return
    setLoading(true)
    setError('')
    try {
      await login(username.trim(), password)
      navigate(-1)
    } catch {
      setError('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password || loading) return
    setLoading(true)
    setError('')
    try {
      await register(username.trim(), password)
      navigate(-1)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '注册失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      await sendLoginEmail(email.trim())
      setEmailSent(true)
    } catch {
      setError('发送失败，请检查邮箱')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">查看你的邮箱</h1>
          <p className="text-gray-500 mb-6">
            登录链接已发送到 <strong>{email}</strong>，<br />点击邮件中的链接即可登录。
          </p>
          <p className="text-sm text-gray-400">链接 15 分钟内有效</p>
          <button onClick={() => { setEmailSent(false); setEmail(''); setTab('email') }} className="mt-6 text-sm text-purple-600 hover:text-purple-700">返回</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">登录 UseGPT</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => { setTab('login'); setError('') }} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>登录</button>
          <button onClick={() => { setTab('register'); setError('') }} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>注册</button>
          <button onClick={() => { setTab('email'); setError('') }} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>邮箱登录</button>
        </div>

        {tab === 'login' && (
          <form onSubmit={handlePasswordLogin}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" autoFocus className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4" />
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <button type="submit" disabled={!username.trim() || !password || loading} className="w-full py-3 text-base font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名（2-20个字符）" autoFocus className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码（至少6位）" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4" />
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <button type="submit" disabled={!username.trim() || password.length < 6 || loading} className="w-full py-3 text-base font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}

        {tab === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <p className="text-sm text-gray-500 mb-4">输入邮箱，我们会发送登录链接给你</p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoFocus className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4" />
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <button type="submit" disabled={!email.trim() || loading} className="w-full py-3 text-base font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {loading ? '发送中...' : '发送登录链接'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
