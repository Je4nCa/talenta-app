import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import type { CeldaRIE } from '../types'

export function useRIE() {
  const uid = useAuth((state) => state.usuario?.uid)
  const { datos: celdas, cargando } = useColeccionUsuario<CeldaRIE>(uid, 'rie')

  return { celdas, cargando }
}
