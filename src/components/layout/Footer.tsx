import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                UseGPT
              </span>
            </div>
            <p className="text-sm text-gray-500">
              发现更好用的 AI 技能，复制即用。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">探索</h4>
            <div className="space-y-2">
              <Link to="/skills" className="block text-sm text-gray-500 hover:text-purple-600">技能广场</Link>
              <Link to="/skills?sort=popular" className="block text-sm text-gray-500 hover:text-purple-600">热门技能</Link>
              <Link to="/skills?sort=latest" className="block text-sm text-gray-500 hover:text-purple-600">最新发布</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">分类</h4>
            <div className="space-y-2">
              <Link to="/skills?category=1" className="block text-sm text-gray-500 hover:text-purple-600">写作</Link>
              <Link to="/skills?category=4" className="block text-sm text-gray-500 hover:text-purple-600">编程</Link>
              <Link to="/skills?category=2" className="block text-sm text-gray-500 hover:text-purple-600">营销</Link>
              <Link to="/skills?category=7" className="block text-sm text-gray-500 hover:text-purple-600">图片生成</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">关于</h4>
            <div className="space-y-2">
              <span className="block text-sm text-gray-500">usegpt.top</span>
              <span className="block text-sm text-gray-500">AI 技能市场</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} UseGPT.top — AI Skills Marketplace
        </div>
      </div>
    </footer>
  )
}
