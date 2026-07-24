import { useLiveQuery } from 'dexie-react-hooks'
import { pagosDb } from '../lib/db'
import type { Suscripcion } from '../types/suscripcion'

interface UseSuscripcionResultado {
  loading: boolean
  error: null
  suscripcion: Suscripcion | null
}

/**
 * `undefined` mientras Dexie no ha resuelto la consulta, `null` cuando ya
 * resolvió y el usuario no tiene ninguna suscripción registrada — hay que
 * distinguir ambos casos para no mostrar "cargando" para siempre.
 */
export function useSuscripcion(uid: string): UseSuscripcionResultado {
  const resultado = useLiveQuery(async () => {
    const todas = await pagosDb.suscripciones.where('uid').equals(uid).sortBy('creadoEn')
    return todas[todas.length - 1] ?? null
  }, [uid])

  return {
    loading: resultado === undefined,
    error: null,
    suscripcion: resultado ?? null,
  }
}
