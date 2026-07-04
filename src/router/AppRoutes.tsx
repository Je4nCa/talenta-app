import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminHome } from '@/modules/admin/components/AdminHome'
import { ProfileScreen } from '@/modules/auth/components/ProfileScreen'
import { BibleHome } from '@/modules/bible/components/BibleHome'
import { CourseHome } from '@/modules/course/components/CourseHome'
import { FinancesHome } from '@/modules/finances/components/FinancesHome'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { AppShell } from './AppShell'
import { HubScreen } from './HubScreen'

export function AppRoutes() {
  const esAdmin = useAuth((state) => state.usuario?.rol === 'admin')

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HubScreen />} />
        <Route path="curso" element={<CourseHome />} />
        <Route path="biblia" element={<BibleHome />} />
        <Route path="finanzas" element={<FinancesHome />} />
        <Route path="perfil" element={<ProfileScreen />} />
        <Route path="admin" element={esAdmin ? <AdminHome /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
