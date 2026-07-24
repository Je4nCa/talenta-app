import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminHome } from '@/modules/admin/components/AdminHome'
import { AsistenteHome } from '@/modules/asistente/components/AsistenteHome'
import { ProfileScreen } from '@/modules/auth/components/ProfileScreen'
import { BibleHome } from '@/modules/bible/components/BibleHome'
import { FinancesEntry } from '@/modules/finances/components/FinancesEntry'
import { CreditosDeudas } from '@/modules/finances/components/pages/CreditosDeudas'
import { Dashboard } from '@/modules/finances/components/pages/Dashboard'
import { Gastos } from '@/modules/finances/components/pages/Gastos'
import { Pagos } from '@/modules/finances/components/pages/Pagos'
import { Tarjetas } from '@/modules/finances/components/pages/Tarjetas'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SuscripcionScreen } from '@/modules/payments/components/SuscripcionScreen'
import { AppShell } from './AppShell'
import { HubScreen } from './HubScreen'

export function AppRoutes() {
  const esAdmin = useAuth((state) => state.usuario?.rol === 'admin')

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HubScreen />} />
        <Route path="biblia" element={<BibleHome />} />
        <Route path="asistente" element={<AsistenteHome />} />
        <Route path="perfil" element={<ProfileScreen />} />
        <Route path="perfil/suscripcion" element={<SuscripcionScreen />} />
        <Route path="admin" element={esAdmin ? <AdminHome /> : <Navigate to="/" replace />} />
      </Route>

      <Route path="finanzas" element={<FinancesEntry />}>
        <Route index element={<Dashboard />} />
        <Route path="gastos" element={<Gastos />} />
        <Route path="tarjetas" element={<Tarjetas />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="deudas" element={<CreditosDeudas />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
