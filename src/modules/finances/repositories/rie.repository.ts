import { finanzasDB } from '../lib/db'
import type { CeldaRIE, CategoriaRIE } from '../types'
import { BaseRepository } from './base.repository'

class RIERepository extends BaseRepository<CeldaRIE> {
  constructor() {
    super(finanzasDB.rie)
  }

  async guardarValor(uid: string, dia: number, categoria: CategoriaRIE, monto: number): Promise<void> {
    await this.tabla.put({
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
