import { createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { HomePage } from './pages/HomePage'
import { SkillListPage } from './pages/SkillListPage'
import { SkillDetailPage } from './pages/SkillDetailPage'
import { SearchPage } from './pages/SearchPage'
import { CreateSkillPage } from './pages/CreateSkillPage'
import { EditSkillPage } from './pages/EditSkillPage'
import { RankingPage } from './pages/RankingPage'
import { UserProfilePage } from './pages/UserProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'skills', element: <SkillListPage /> },
      { path: 'skills/:id', element: <SkillDetailPage /> },
      { path: 'skills/:id/edit', element: <EditSkillPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'create', element: <CreateSkillPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'user/:id', element: <UserProfilePage /> },
    ],
  },
])
