/**
 * Código promocional para estudiantes del curso: es la única forma de
 * crear una cuenta en TALENTA (obligatorio en el registro). Otorga
 * acceso gratuito durante la duración del curso. Vencido ese período,
 * el acceso continuado requiere una suscripción de pago (TiloPay,
 * pendiente de integrar).
 *
 * Además del código, el correo ingresado debe coincidir con la lista de
 * estudiantes inscritos (`CORREOS_ESTUDIANTES_HASH` en
 * `estudiantesInscritos.ts`) — el código solo no basta para este flujo.
 *
 * No mostrar nunca este valor en la UI (placeholders, ejemplos, etc.) —
 * es privado, solo lo conocen los estudiantes inscritos.
 */
export const CODIGO_PROMOCIONAL_VALIDO = 'CURSOTALE26'

/**
 * Código para administradores/facilitadores: no requiere que el correo
 * esté en la lista de estudiantes inscritos, y la cuenta creada con este
 * código queda con rol `admin` (acceso al panel de administración) en vez
 * de `student`. No mostrar nunca este valor en la UI — igual de privado
 * que el código de estudiante, o más.
 */
export const CODIGO_PROMOCIONAL_ADMIN = 'TALENTAADMIN272612'

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
