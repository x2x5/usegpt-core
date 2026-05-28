import { createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { HomePage } from './pages/HomePage'
import { SkillListPage } from './pages/SkillListPage'
import { SkillDetailPage } from './pages/SkillDetailPage'
import { SearchPage } from './pages/SearchPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'skills', element: <SkillListPage /> },
      { path: 'skills/:id', element: <SkillDetailPage /> },
      { path: 'search', element: <SearchPage /> },
    ],
  },
])
