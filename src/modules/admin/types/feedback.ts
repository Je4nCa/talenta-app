/**
 * Feedback enviado por un usuario desde Perfil.
 *
 * Se guarda en Firestore **además** de enviarse por correo con EmailJS: el
 * correo puede fallar, terminar en spam o llegar a un buzón equivocado, y
 * hasta ahora no quedaba ningún registro — no había forma de saber si
 * alguien había escrito. Aquí queda siempre, visible en el panel de admin.
 */
export interface Feedback {
  id: string
  uid: string
  nombre: string
  email: string
  mensaje: string
  creadoEn: string
  /** Si el correo de EmailJS salió bien; permite detectar fallos de envío. */
  correoEnviado: boolean
  leido?: boolean
}
