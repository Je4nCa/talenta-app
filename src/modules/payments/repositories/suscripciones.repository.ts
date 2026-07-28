import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { Suscripcion } from '../types/suscripcion'

class SuscripcionesRepository extends FirestoreRepository<Suscripcion> {
  constructor() {
    super('suscripciones')
  }

  async obtenerActualPorUsuario(uid: string): Promise<Suscripcion | undefined> {
    const todas = await this.obtenerTodos(uid)
    const ordenadas = [...todas].sort((a, b) => a.creadoEn.localeCompare(b.creadoEn))
    return ordenadas[ordenadas.length - 1]
  }
}

export const suscripcionesRepository = new SuscripcionesRepository()
