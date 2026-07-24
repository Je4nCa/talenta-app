import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { PLANES_SUSCRIPCION } from '../constants/planes'
import type { PlanId } from '../types/plan'

interface PlanesSuscripcionProps {
  planSeleccionado: PlanId
  onSeleccionar: (planId: PlanId) => void
}

export function PlanesSuscripcion({ planSeleccionado, onSeleccionar }: PlanesSuscripcionProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      {PLANES_SUSCRIPCION.map((plan) => {
        const seleccionado = plan.id === planSeleccionado
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSeleccionar(plan.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left shadow-sm transition-colors',
              seleccionado
                ? 'border-talenta-gold bg-talenta-gold/10'
                : 'border-talenta-tan/60 bg-talenta-white/80',
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                  seleccionado
                    ? 'border-talenta-gold bg-talenta-gold text-talenta-white'
                    : 'border-talenta-brown-mid',
                )}
              >
                {seleccionado && <Check className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-base font-semibold text-talenta-black">{plan.nombre}</p>
                <p className="text-sm text-talenta-brown-mid">
                  ${plan.precioMensualEquivalenteUSD.toFixed(2)}/mes
                  {plan.descuentoPorcentaje > 0 && ` · Ahorra ${plan.descuentoPorcentaje}%`}
                </p>
              </div>
            </div>
            <p className="text-lg font-semibold text-talenta-black">
              ${plan.precioUSD.toFixed(2)}
            </p>
          </button>
        )
      })}
    </div>
  )
}
