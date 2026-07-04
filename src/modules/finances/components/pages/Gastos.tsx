import { Receipt } from 'lucide-react'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function Gastos() {
  return (
    <ModulePlaceholder
      icon={Receipt}
      titulo="Gastos"
      descripcion="Aquí registrarás tus gastos variables y fijos. Muy pronto disponible."
    />
  )
}
