import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { MontoManualTarjeta } from '../types'

class MontosManualesRepository extends FirestoreRepository<MontoManualTarjeta> {
  constructor() {
    super('montosManuales')
  }

  idPara(tarjetaId: string, anio: number, mes: number): string {
    return `${tarjetaId}-${anio}-${mes}`
  }
}

export const montosManualesRepository = new MontosManualesRepository()
