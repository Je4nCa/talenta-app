import type { ID, FechaHoraISO } from './comunes'

export interface Salario {
  id: ID
  uid: string
  monto: number
  anio: number
  mes: number
  /** 1 = primera quincena, 2 = segunda quincena */
  quincena: 1 | 2
  notas?: string
  creadoEn: FechaHoraISO
}
