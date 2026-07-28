import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import type { Suscripcion } from '../types/suscripcion'

interface UseSuscripcionResultado {
  loading: boolean
  error: null
  suscripcion: Suscripcion | null
}

export function useSuscripcion(uid: string): UseSuscripcionResultado {
  const { datos, cargando } = useColeccionUsuario<Suscripcion>(uid, 'suscripciones')
  const ordenadas = [...datos].sort((a, b) => a.creadoEn.localeCompare(b.creadoEn))

  return {
    loading: cargando,
    error: null,
    suscripcion: ordenadas[ordenadas.length - 1] ?? null,
  }
}
