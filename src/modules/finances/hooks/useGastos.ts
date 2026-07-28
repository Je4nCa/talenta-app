import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import type { Gasto, GastoFijo } from '../types'

export function useGastosPorPeriodo(anio: number, mes: number) {
  const uid = useAuth((state) => state.usuario?.uid)
  const prefijo = `${anio}-${String(mes).padStart(2, '0')}`
  const { datos: todos, cargando } = useColeccionUsuario<Gasto>(uid, 'gastos')

  const gastos = todos.filter((g) => (g.fechaCobro ?? g.fecha).startsWith(prefijo))

  return { gastos, cargando }
}

export function useGastosFijos() {
  const uid = useAuth((state) => state.usuario?.uid)
  const { datos: gastosFijos, cargando } = useColeccionUsuario<GastoFijo>(uid, 'gastosFijos')

  return { gastosFijos, cargando }
}
