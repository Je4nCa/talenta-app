export type ID = string

/** Fecha en formato YYYY-MM-DD */
export type FechaISO = string

/** Fecha + hora en formato ISO 8601 */
export type FechaHoraISO = string

export interface PeriodoMensual {
  anio: number
  mes: number // 1–12
}
