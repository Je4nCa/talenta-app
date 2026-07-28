import { TipoRecurrencia } from '../types/gasto'

export const OPCIONES_RECURRENCIA: { valor: TipoRecurrencia; etiqueta: string }[] = [
  { valor: TipoRecurrencia.Semanal, etiqueta: 'Cada semana' },
  { valor: TipoRecurrencia.Quincenal, etiqueta: 'Cada quincena' },
  { valor: TipoRecurrencia.Mensual, etiqueta: 'Cada mes' },
  { valor: TipoRecurrencia.Bimestral, etiqueta: 'Cada 2 meses' },
  { valor: TipoRecurrencia.Trimestral, etiqueta: 'Cada 3 meses' },
  { valor: TipoRecurrencia.Semestral, etiqueta: 'Cada 6 meses' },
  { valor: TipoRecurrencia.Anual, etiqueta: 'Cada año' },
]

export const ETIQUETA_RECURRENCIA: Record<TipoRecurrencia, string> = Object.fromEntries(
  OPCIONES_RECURRENCIA.map((o) => [o.valor, o.etiqueta]),
) as Record<TipoRecurrencia, string>

/**
 * Cuántas veces se paga al mes cada recurrencia.
 *
 * Semanal usa 52/12 ≈ 4,33 (no 4) porque un año tiene 52 semanas, no 48:
 * cobrar 4 dejaría el presupuesto corto casi un mes al año. Quincenal es
 * exactamente 2. Las recurrencias de varios meses se prorratean para que el
 * balance mensual refleje lo que hay que ir apartando cada mes.
 */
const VECES_POR_MES: Record<TipoRecurrencia, number> = {
  [TipoRecurrencia.Semanal]: 52 / 12,
  [TipoRecurrencia.Quincenal]: 2,
  [TipoRecurrencia.Mensual]: 1,
  [TipoRecurrencia.Bimestral]: 1 / 2,
  [TipoRecurrencia.Trimestral]: 1 / 3,
  [TipoRecurrencia.Semestral]: 1 / 6,
  [TipoRecurrencia.Anual]: 1 / 12,
}

/** Lo que representa este gasto fijo dentro de un mes. */
export function montoMensualEquivalente(monto: number, recurrencia: TipoRecurrencia): number {
  return monto * (VECES_POR_MES[recurrencia] ?? 1)
}
