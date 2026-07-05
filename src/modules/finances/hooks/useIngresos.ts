import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function useIngresosPorPeriodo(anio: number, mes: number) {
  const uid = useAuth((state) => state.usuario?.uid)
  const prefijo = `${anio}-${String(mes).padStart(2, '0')}`

  const ingresos = useLiveQuery(async () => {
    if (!uid) return []
    const todos = await finanzasDB.ingresos.where('uid').equals(uid).toArray()
    return todos.filter((i) => i.fecha.startsWith(prefijo))
  }, [uid, prefijo])

  return { ingresos: ingresos ?? [], cargando: ingresos === undefined }
}
