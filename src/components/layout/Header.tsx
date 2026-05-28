import { Link, useLocation } from 'react-router-dom'
import { SearchInput } from '../ui/SearchInput'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const isHome = location.pathname === '/'
  const { user, loading, login, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            UseGPT
          </span>
        </Link>

        {!isHome && (
          <div className="flex-1 max-w-md mx-auto">
            <SearchInput />
          </div>
        )}

        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link to="/skills" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
            技能广场
          </Link>
          <Link to="/ranking" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
            排行榜
          </Link>
          {user ? (
            <>
              <Link to="/create" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors">
                发布技能
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.displayName || user.username}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <Link
                      to={`/user/${user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      我的主页
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            !loading && (
              <button
                onClick={login}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
              >
                登录
              </button>
            )
          )}
        </nav>

        <button
          className="md:hidden ml-auto p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            to="/skills"
            className="block text-base font-medium text-gray-700 hover:text-purple-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            技能广场
          </Link>
          <Link
            to="/ranking"
            className="block text-base font-medium text-gray-700 hover:text-purple-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            排行榜
          </Link>
          {user ? (
            <>
              <Link
                to="/create"
                className="block text-base font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                发布技能
              </Link>
              <Link
                to={`/user/${user.id}`}
                className="block text-base font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                我的主页
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false) }}
                className="w-full py-3 text-base font-medium text-red-600 border border-red-200 rounded-xl"
              >
                退出登录
              </button>
            </>
          ) : (
            !loading && (
              <button
                onClick={login}
                className="w-full py-3 text-base font-medium text-white bg-gray-900 rounded-xl"
              >
                登录
              </button>
            )
          )}
        </div>
      )}
    </header>
  )
}
