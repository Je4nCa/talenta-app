import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function useTarjetas() {
  const uid = useAuth((state) => state.usuario?.uid)

  const tarjetas = useLiveQuery(async () => {
    if (!uid) return []
    return finanzasDB.tarjetas.where('uid').equals(uid).toArray()
  }, [uid])

  return { tarjetas: tarjetas ?? [], cargando: tarjetas === undefined }
}

export function useTarjeta(id: string | undefined) {
  const tarjeta = useLiveQuery(async () => {
    if (!id) return undefined
    return finanzasDB.tarjetas.get(id)
  }, [id])

  return { tarjeta }
}
