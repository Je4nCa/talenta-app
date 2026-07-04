import { Percent } from 'lucide-react'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function TasaCero() {
  return (
    <ModulePlaceholder
      icon={Percent}
      titulo="Tasa cero"
      descripcion="Aquí darás seguimiento a tus compras a cuotas sin intereses. Muy pronto disponible."
    />
  )
}
