import type { ID, FechaHoraISO, FechaISO } from './comunes'

export type TipoTarjeta = 'credito' | 'debito'

export interface TarjetaCredito {
  id: ID
  uid: string
  banco: string
  nombre: string
  tipo: TipoTarjeta
  color: string
  creadoEn: FechaHoraISO
  actualizadoEn: FechaHoraISO
  /** Solo crédito: límite de la tarjeta */
  limite?: number
  /** Solo crédito: día de cierre del estado de cuenta (1–31) */
  diaCierre?: number
  /** Solo crédito: día de vencimiento del pago mínimo (1–31) */
  diaPago?: number
  /** Solo débito: saldo inicial (base para calcular el disponible) */
  saldoInicial?: number
}

/** Abono / pago adelantado a una tarjeta de crédito */
export interface AbonoTarjeta {
  id: ID
  tarjetaId: ID
  uid: string
  anio: number
  mes: number
  monto: number
  fecha: FechaISO
  notas?: string
  creadoEn: FechaHoraISO
}

/** Monto manual a pagar (override del calculado) */
export interface MontoManualTarjeta {
  id: ID // `${tarjetaId}-${anio}-${mes}`
  tarjetaId: ID
  anio: number
  mes: number
  monto: number
  creadoEn: FechaHoraISO
}
