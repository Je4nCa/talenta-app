import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { Bien, CategoriaBien } from '../types'

class BienesRepository extends FirestoreRepository<Bien> {
  constructor() {
    super('bienes')
  }

  async guardarValor(uid: string, categoria: CategoriaBien, valorActual: number): Promise<void> {
    await this.crear({
      id: `${uid}-${categoria}`,
      uid,
      categoria,
      valorActual,
      actualizadoEn: new Date().toISOString(),
    })
  }
}

export const bienesRepository = new BienesRepository()
