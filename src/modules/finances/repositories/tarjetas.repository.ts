import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { TarjetaCredito } from '../types'

class TarjetasRepository extends FirestoreRepository<TarjetaCredito> {
  constructor() {
    super('tarjetas')
  }
}

export const tarjetasRepository = new TarjetasRepository()
