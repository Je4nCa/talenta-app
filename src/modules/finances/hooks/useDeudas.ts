import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import type { AbonoDeuda, Deuda } from '../types'

export function useDeudas() {
  const uid = useAuth((state) => state.usuario?.uid)
  const { datos: deudas, cargando } = useColeccionUsuario<Deuda>(uid, 'deudas')

  return { deudas, cargando }
}

export function useAbonosDeuda(uid: string | undefined, deudaId: string | undefined) {
  const { datos: todos, cargando } = useColeccionUsuario<AbonoDeuda>(uid, 'abonosDeuda')
  const abonos = deudaId ? todos.filter((a) => a.deudaId === deudaId) : []

  return { abonos, cargando }
}
