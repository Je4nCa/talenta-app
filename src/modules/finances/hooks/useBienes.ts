import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function useBienes() {
  const uid = useAuth((state) => state.usuario?.uid)

  const bienes = useLiveQuery(async () => {
    if (!uid) return []
    return finanzasDB.bienes.where('uid').equals(uid).toArray()
  }, [uid])

  return { bienes: bienes ?? [], cargando: bienes === undefined }
}
