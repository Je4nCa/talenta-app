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
 * Código de SUPER ADMIN: Carlos, Alicia y Jean (Montevo Studio). No requiere
 * que el correo esté en la lista de estudiantes inscritos. La cuenta queda
 * con rol `superadmin` — acceso completo a la app (sin prueba ni costo) más
 * el panel de administración. No mostrar nunca este valor en la UI — es el
 * más privado de los tres códigos.
 */
export const CODIGO_PROMOCIONAL_SUPERADMIN = 'TALENTAADMIN272612'

/**
 * Código de facilitador: tampoco requiere que el correo esté en la lista de
 * estudiantes inscritos. La cuenta queda con rol `facilitador` — acceso
 * completo a la app (sin prueba ni costo), igual que `superadmin`, pero
 * **sin** acceso al panel de administración. No mostrar nunca este valor
 * en la UI.
 */
export const CODIGO_PROMOCIONAL_FACILITADOR = 'TALEFACILITA2026'

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
