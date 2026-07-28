import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import type { Bien } from '../types'

export function useBienes() {
  const uid = useAuth((state) => state.usuario?.uid)
  const { datos: bienes, cargando } = useColeccionUsuario<Bien>(uid, 'bienes')

  return { bienes, cargando }
}
