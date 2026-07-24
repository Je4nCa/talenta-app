import { finanzasDB } from '../lib/db'
import type { Bien, CategoriaBien } from '../types'
import { BaseRepository } from './base.repository'

class BienesRepository extends BaseRepository<Bien> {
  constructor() {
    super(finanzasDB.bienes)
  }

  async guardarValor(uid: string, categoria: CategoriaBien, valorActual: number): Promise<void> {
    await this.tabla.put({
      id: `${uid}-${categoria}`,
      uid,
      categoria,
      valorActual,
      actualizadoEn: new Date().toISOString(),
    })
  }
}

export const bienesRepository = new BienesRepository()
