import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import type { Ingreso } from '../types'

export function useIngresosPorPeriodo(anio: number, mes: number) {
  const uid = useAuth((state) => state.usuario?.uid)
  const prefijo = `${anio}-${String(mes).padStart(2, '0')}`
  const { datos: todos, cargando } = useColeccionUsuario<Ingreso>(uid, 'ingresos')

  const ingresos = todos.filter((i) => i.fecha.startsWith(prefijo))

  return { ingresos, cargando }
}
