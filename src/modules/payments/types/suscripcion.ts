import type { PlanId } from './plan'

export type EstadoSuscripcion = 'pendiente' | 'activa' | 'vencida' | 'cancelada'

export interface Suscripcion {
  id: string
  uid: string
  planId: PlanId
  montoUSD: number
  estado: EstadoSuscripcion
  /** Número de orden enviado a TiloPay (`orderNumber`) — debe ser único. */
  ordenId: string
  creadoEn: string
  fechaInicio?: string
  fechaVencimiento?: string
  /** Referencia/token que devuelve TiloPay (transacción o tarjeta tokenizada). */
  tilopayReferencia?: string
}
