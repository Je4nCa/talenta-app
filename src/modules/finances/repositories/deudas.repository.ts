import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { Deuda } from '../types'

class DeudasRepository extends FirestoreRepository<Deuda> {
  constructor() {
    super('deudas')
  }
}

export const deudasRepository = new DeudasRepository()
