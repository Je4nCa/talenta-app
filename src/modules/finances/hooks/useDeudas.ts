import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function useDeudas() {
  const uid = useAuth((state) => state.usuario?.uid)

  const deudas = useLiveQuery(async () => {
    if (!uid) return []
    return finanzasDB.deudas.where('uid').equals(uid).toArray()
  }, [uid])

  return { deudas: deudas ?? [], cargando: deudas === undefined }
}

export function useAbonosDeuda(deudaId: string | undefined) {
  const abonos = useLiveQuery(async () => {
    if (!deudaId) return []
    return finanzasDB.abonosDeuda.where('deudaId').equals(deudaId).toArray()
  }, [deudaId])

  return { abonos: abonos ?? [], cargando: abonos === undefined }
}
