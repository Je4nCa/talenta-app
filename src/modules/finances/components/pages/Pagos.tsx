import { Wallet } from 'lucide-react'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function Pagos() {
  return (
    <ModulePlaceholder
      icon={Wallet}
      titulo="Pagos"
      descripcion="Aquí verás el desglose de pago de tus tarjetas de crédito. Muy pronto disponible."
    />
  )
}
