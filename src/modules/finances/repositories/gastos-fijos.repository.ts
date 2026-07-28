import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { GastoFijo } from '../types'

class GastosFijosRepository extends FirestoreRepository<GastoFijo> {
  constructor() {
    super('gastosFijos')
  }
}

export const gastosFijosRepository = new GastosFijosRepository()
