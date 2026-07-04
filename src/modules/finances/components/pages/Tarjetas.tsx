import { CreditCard } from 'lucide-react'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function Tarjetas() {
  return (
    <ModulePlaceholder
      icon={CreditCard}
      titulo="Tarjetas"
      descripcion="Aquí administrarás tus tarjetas de crédito y débito. Muy pronto disponible."
    />
  )
}
