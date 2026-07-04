import type { ID, FechaHoraISO, FechaISO } from './comunes'

export enum EstadoCuota {
  Pendiente = 'pendiente',
  Pagada = 'pagada',
  Vencida = 'vencida',
}

/**
 * Representa una compra a tasa cero.
 * Al crearse, genera automáticamente N registros CuotaMensual — uno por mes.
 */
export interface PlanCuotas {
  id: ID
  uid: string
  nombreProducto: string
  montoTotal: number
  numeroCuotas: number
  /** Pre-calculado: montoTotal / numeroCuotas */
  montoCuota: number
  fechaInicio: FechaISO
  fechaFin: FechaISO
  tarjetaId: ID
  fechaCompra?: string
  creadoEn: FechaHoraISO
}

/** Entrada independiente por cada mes del plan. */
export interface CuotaMensual {
  id: ID
  planCuotasId: ID
  numeroCuota: number // 1 … numeroCuotas
  mes: number // 1–12
  anio: number
  monto: number
  estado: EstadoCuota
}

export interface CuotaMensualDetalle extends CuotaMensual {
  nombreProducto: string
  tarjetaId: ID
  progresoTexto: string // ej. "3 / 24"
}
