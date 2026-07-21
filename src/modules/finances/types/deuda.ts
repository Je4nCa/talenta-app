import type { ID, FechaHoraISO, FechaISO } from './comunes'

export enum TipoDeuda {
  TarjetaCredito = 'tarjeta_credito',
  PrestamoPersonal = 'prestamo_personal',
  PrestamoBancario = 'prestamo_bancario',
  Otro = 'otro',
}

export interface Deuda {
  id: ID
  uid: string
  nombre: string
  tipo: TipoDeuda
  montoOriginal: number
  /** Se reduce con cada abono registrado. */
  saldoActual: number
  /** % anual, opcional — no todas las deudas tienen tasa (ej. préstamo con un familiar). */
  tasaInteres?: number
  /** Pago mensual esperado, opcional. */
  cuotaMensual?: number
  fechaInicio: FechaISO
  notas?: string
  creadoEn: FechaHoraISO
  actualizadoEn: FechaHoraISO
}

export interface AbonoDeuda {
  id: ID
  deudaId: ID
  uid: string
  monto: number
  fecha: FechaISO
  creadoEn: FechaHoraISO
}
