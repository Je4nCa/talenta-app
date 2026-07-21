/**
 * Código promocional para estudiantes del curso: otorga acceso gratuito
 * a TALENTA durante la duración del curso (1 mes). Vencido ese período,
 * el acceso continuado requiere una suscripción de pago (TiloPay,
 * pendiente de integrar).
 */
export const CODIGO_PROMOCIONAL_VALIDO = '2026TALENTAOFF'

export const DIAS_PERIODO_GRATUITO_MESES = 1

export function calcularFinPeriodoGratuito(desde: Date): string {
  const fin = new Date(desde)
  fin.setMonth(fin.getMonth() + DIAS_PERIODO_GRATUITO_MESES)
  return fin.toISOString().slice(0, 10)
}
