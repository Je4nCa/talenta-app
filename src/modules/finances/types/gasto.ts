import type { ID, FechaHoraISO, FechaISO } from './comunes'
import type { CategoriaId } from './categoria'

export type TipoPago = 'contado' | 'tarjeta' | 'debito'

export interface Gasto {
  id: ID
  uid: string
  titulo: string
  monto: number
  categoriaId: CategoriaId
  tarjetaId?: ID
  tipoPago: TipoPago
  fecha: FechaISO
  notas?: string
  creadoEn: FechaHoraISO
  actualizadoEn: FechaHoraISO
}

export enum TipoRecurrencia {
  Mensual = 'mensual',
  Bimestral = 'bimestral',
  Trimestral = 'trimestral',
  Semestral = 'semestral',
  Anual = 'anual',
}

export interface GastoFijo {
  id: ID
  uid: string
  titulo: string
  monto: number
  recurrencia: TipoRecurrencia
  tarjetaId?: ID
  categoriaId: CategoriaId
  activo: boolean
  creadoEn: FechaHoraISO
  actualizadoEn: FechaHoraISO
}

export interface FiltrosGasto {
  tarjetaId?: ID
  categoriaId?: CategoriaId
  soloFijos?: boolean
  desde?: FechaISO
  hasta?: FechaISO
}
