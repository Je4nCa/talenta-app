/**
 * Código promocional para estudiantes del curso: es la única forma de
 * crear una cuenta en TALENTA (obligatorio en el registro). Otorga
 * acceso gratuito durante la duración del curso. Vencido ese período,
 * el acceso continuado requiere una suscripción de pago (TiloPay,
 * pendiente de integrar).
 *
 * No mostrar nunca este valor en la UI (placeholders, ejemplos, etc.) —
 * es privado, solo lo conocen los estudiantes inscritos.
 */
export const CODIGO_PROMOCIONAL_VALIDO = 'CURSOTALE26'

/**
 * La prueba gratuita NO se cuenta desde la fecha de registro de cada
 * usuario — inicia el mismo día para todos (fecha de arranque real del
 * curso), sin importar cuándo se registre cada estudiante.
 */
export const INICIO_PERIODO_GRATUITO = '2026-07-27'
export const DIAS_PERIODO_GRATUITO_MESES = 1

export function obtenerFinPeriodoGratuito(): string {
  const fin = new Date(`${INICIO_PERIODO_GRATUITO}T00:00:00`)
  fin.setMonth(fin.getMonth() + DIAS_PERIODO_GRATUITO_MESES)
  return fin.toISOString().slice(0, 10)
}
