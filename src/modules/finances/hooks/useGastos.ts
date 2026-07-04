import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function useGastosPorPeriodo(anio: number, mes: number) {
  const uid = useAuth((state) => state.usuario?.uid)
  const prefijo = `${anio}-${String(mes).padStart(2, '0')}`

  const gastos = useLiveQuery(async () => {
    if (!uid) return []
    const todos = await finanzasDB.gastos.where('uid').equals(uid).toArray()
    return todos.filter((g) => g.fecha.startsWith(prefijo))
  }, [uid, prefijo])

  return { gastos: gastos ?? [], cargando: gastos === undefined }
}

export function useGastosFijos() {
  const uid = useAuth((state) => state.usuario?.uid)

  const gastosFijos = useLiveQuery(async () => {
    if (!uid) return []
    return finanzasDB.gastosFijos.where('uid').equals(uid).toArray()
  }, [uid])

  return { gastosFijos: gastosFijos ?? [], cargando: gastosFijos === undefined }
}
