import { Wallet } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function FinancesHome() {
  return (
    <ModuleScreen icon={Wallet} label="Finanzas" durationMs={1300}>
      <ModulePlaceholder
        icon={Wallet}
        titulo="Finanzas Esencial"
        descripcion="Estamos adaptando el módulo completo de finanzas a TALENTA. Muy pronto verás tu presupuesto, gastos y balances aquí."
      />
    </ModuleScreen>
  )
}
