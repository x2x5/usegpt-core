import { Link, useLocation } from 'react-router-dom'
import { SearchInput } from '../ui/SearchInput'
import { useState } from 'react'

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isHome = location.pathname === '/'

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
          <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors">
            发布技能
          </button>
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
          <button className="w-full py-3 text-base font-medium text-white bg-purple-600 rounded-xl">
            发布技能
          </button>
        </div>
      )}
    </header>
  )
}
