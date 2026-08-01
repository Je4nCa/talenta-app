/**
 * Correo autorizado a registrarse como estudiante, administrable desde el
 * panel (colección `correosAutorizados` en Firestore).
 *
 * El **id del documento es el hash SHA-256** del correo canónico: durante el
 * registro la app pregunta por ese id concreto, sin poder listar la
 * colección. Así alguien que no conozca el correo tampoco puede obtenerlo,
 * y solo un `superadmin` puede ver la lista completa (ver `firestore.rules`).
 */
export interface CorreoAutorizado {
  /** SHA-256 del correo canónico — también es el id del documento. */
  id: string
  /** Correo tal como lo escribió el admin, para poder mostrarlo en el panel. */
  email: string
  /** Correo del admin que lo agregó. */
  agregadoPor: string
  agregadoEn: string
  nota?: string
}
