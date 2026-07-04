import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'

export function usePlanesCuotas() {
  const uid = useAuth((state) => state.usuario?.uid)

  const planes = useLiveQuery(async () => {
    if (!uid) return []
    return finanzasDB.planesCuotas.where('uid').equals(uid).toArray()
  }, [uid])

  return { planes: planes ?? [], cargando: planes === undefined }
}

export function useCuotasPorPeriodo(anio: number, mes: number) {
  const cuotas = useLiveQuery(async () => {
    return finanzasDB.cuotasMensuales.where({ anio, mes }).toArray()
  }, [anio, mes])

  return { cuotas: cuotas ?? [], cargando: cuotas === undefined }
}

export function useCuotasPorPlan(planCuotasId: string | undefined) {
  const cuotas = useLiveQuery(async () => {
    if (!planCuotasId) return []
    return finanzasDB.cuotasMensuales.where('planCuotasId').equals(planCuotasId).toArray()
  }, [planCuotasId])

  return { cuotas: cuotas ?? [] }
}
