import type { ID, FechaHoraISO, FechaISO } from './comunes'

/**
 * Un ingreso es una entrada libre con fecha real, igual que un Gasto —
 * no asume una frecuencia fija (quincenal, mensual, semanal). El usuario
 * agrega tantos como reciba: un salario mensual es 1 entrada al mes, uno
 * quincenal son 2, uno semanal son ~4, y cualquier ingreso extra
 * (freelance, regalo, venta) es una entrada más sin estructura especial.
 */
export interface Ingreso {
  id: ID
  uid: string
  titulo: string
  monto: number
  fecha: FechaISO
  notas?: string
  creadoEn: FechaHoraISO
}
