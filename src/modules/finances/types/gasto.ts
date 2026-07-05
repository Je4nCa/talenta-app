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
  /**
   * Si la compra se cobra/paga en una fecha distinta a `fecha` (ej. compra
   * de hoy que se cobra hasta fin de mes), este campo indica esa fecha real
   * de cobro. El gasto se cuenta en el mes de `fechaCobro` (si existe) en
   * vez del mes de `fecha`, porque es cuando realmente impacta el balance.
   */
  fechaCobro?: FechaISO
  /**
   * Foto de la factura o comprobante de compra, guardada como respaldo.
   * Opcional. Se guarda tal cual como Blob en Dexie — IndexedDB soporta
   * Blobs de forma nativa, no hace falta convertir a base64.
   */
  facturaImagen?: Blob
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
