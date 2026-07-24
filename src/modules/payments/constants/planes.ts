import type { Plan, PlanId } from '../types/plan'

export const PLANES_SUSCRIPCION: Plan[] = [
  {
    id: 'mensual',
    nombre: 'Mensual',
    precioUSD: 2.99,
    meses: 1,
    precioMensualEquivalenteUSD: 2.99,
    descuentoPorcentaje: 0,
  },
  {
    id: 'trimestral',
    nombre: 'Trimestral',
    precioUSD: 7.99,
    meses: 3,
    precioMensualEquivalenteUSD: 2.66,
    descuentoPorcentaje: 11,
  },
  {
    id: 'anual',
    nombre: 'Anual',
    precioUSD: 27.99,
    meses: 12,
    precioMensualEquivalenteUSD: 2.33,
    descuentoPorcentaje: 22,
  },
]

export function obtenerPlan(planId: PlanId): Plan {
  return PLANES_SUSCRIPCION.find((plan) => plan.id === planId) ?? PLANES_SUSCRIPCION[0]
}
