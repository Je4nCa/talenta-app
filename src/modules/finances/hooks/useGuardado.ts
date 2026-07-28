import { useState } from 'react'

/**
 * Envuelve el guardado de un formulario para que un fallo **siempre** se le
 * muestre al usuario.
 *
 * Antes cada formulario hacía `await repo.crear(...)` sin `try/catch`: si
 * Firestore rechazaba la escritura, la promesa quedaba rechazada en silencio,
 * el formulario no se cerraba y el usuario no veía ningún mensaje — se sentía
 * como que el botón "no hace nada". Fue justo lo que pasó en producción
 * cuando Firestore empezó a rechazar los campos `undefined`, y por eso el
 * problema tardó en detectarse.
 */
export function useGuardado() {
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function guardar(accion: () => Promise<void>, alTerminar: () => void): Promise<void> {
    setGuardando(true)
    setError(null)
    try {
      await accion()
      alTerminar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return { guardando, error, guardar }
}
