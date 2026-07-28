import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import type { TarjetaCredito } from '../types'

export function useTarjetas() {
  const uid = useAuth((state) => state.usuario?.uid)
  const { datos: tarjetas, cargando } = useColeccionUsuario<TarjetaCredito>(uid, 'tarjetas')

  return { tarjetas, cargando }
}
