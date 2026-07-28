import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { CeldaRIE, CategoriaRIE } from '../types'

class RIERepository extends FirestoreRepository<CeldaRIE> {
  constructor() {
    super('rie')
  }

  async guardarValor(uid: string, dia: number, categoria: CategoriaRIE, monto: number): Promise<void> {
    await this.crear({
      id: `${uid}-${dia}-${categoria}`,
      uid,
      dia,
      categoria,
      monto,
      actualizadoEn: new Date().toISOString(),
    })
  }
}

export const rieRepository = new RIERepository()
