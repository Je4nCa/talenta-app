import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminHome } from '@/modules/admin/components/AdminHome'
import { ProfileScreen } from '@/modules/auth/components/ProfileScreen'
import { BibleHome } from '@/modules/bible/components/BibleHome'
import { CourseHome } from '@/modules/course/components/CourseHome'
import { FinancesEntry } from '@/modules/finances/components/FinancesEntry'
import { Dashboard } from '@/modules/finances/components/pages/Dashboard'
import { Gastos } from '@/modules/finances/components/pages/Gastos'
import { Pagos } from '@/modules/finances/components/pages/Pagos'
import { Tarjetas } from '@/modules/finances/components/pages/Tarjetas'
import { TasaCero } from '@/modules/finances/components/pages/TasaCero'
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
        <Route path="perfil" element={<ProfileScreen />} />
        <Route path="admin" element={esAdmin ? <AdminHome /> : <Navigate to="/" replace />} />
      </Route>

      <Route path="finanzas" element={<FinancesEntry />}>
        <Route index element={<Dashboard />} />
        <Route path="gastos" element={<Gastos />} />
        <Route path="tarjetas" element={<Tarjetas />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="tasa-cero" element={<TasaCero />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
