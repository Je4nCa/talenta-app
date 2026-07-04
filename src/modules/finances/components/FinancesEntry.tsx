import { Wallet } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { FinancesShell } from './FinancesShell'

export function FinancesEntry() {
  return (
    <ModuleScreen icon={Wallet} label="Finanzas" durationMs={1300}>
      <FinancesShell />
    </ModuleScreen>
  )
}
