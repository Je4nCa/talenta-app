import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function useRIE() {
  const uid = useAuth((state) => state.usuario?.uid)

  const celdas = useLiveQuery(async () => {
    if (!uid) return []
    return finanzasDB.rie.where('uid').equals(uid).toArray()
  }, [uid])

  return { celdas: celdas ?? [], cargando: celdas === undefined }
}
