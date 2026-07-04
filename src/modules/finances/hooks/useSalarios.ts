import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function useSalariosPorPeriodo(anio: number, mes: number) {
  const uid = useAuth((state) => state.usuario?.uid)

  const salarios = useLiveQuery(async () => {
    if (!uid) return []
    const todos = await finanzasDB.salarios.where('uid').equals(uid).toArray()
    return todos.filter((s) => s.anio === anio && s.mes === mes)
  }, [uid, anio, mes])

  return { salarios: salarios ?? [], cargando: salarios === undefined }
}
