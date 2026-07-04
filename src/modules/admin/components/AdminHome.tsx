import { ShieldCheck } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function AdminHome() {
  return (
    <ModuleScreen icon={ShieldCheck} label="Administración" durationMs={1000}>
      <ModulePlaceholder
        icon={ShieldCheck}
        titulo="Panel de administración"
        descripcion="El roster de alumnos, pagos y seguimiento semanal estarán disponibles aquí muy pronto."
      />
    </ModuleScreen>
  )
}
