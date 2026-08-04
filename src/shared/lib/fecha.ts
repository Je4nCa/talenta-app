/**
 * Fecha de hoy (YYYY-MM-DD) en la zona horaria **del usuario**.
 *
 * **No usar `new Date().toISOString().slice(0, 10)`**: eso devuelve la fecha
 * en UTC. En Costa Rica (UTC-6) a partir de las 6 p.m. ya es el día
 * siguiente en UTC, así que el formulario proponía mañana en vez de hoy — y
 * un gasto registrado la noche del último día del mes caía en el mes
 * siguiente y desaparecía de la vista del mes en curso.
 */
export function fechaHoyLocal(): string {
  const ahora = new Date()
  const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}
