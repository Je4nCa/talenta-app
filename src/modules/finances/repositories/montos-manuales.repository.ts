import { finanzasDB } from '../lib/db'
import type { MontoManualTarjeta } from '../types'
import { BaseRepository } from './base.repository'

class MontosManualesRepository extends BaseRepository<MontoManualTarjeta> {
  constructor() {
    super(finanzasDB.montosManuales)
  }

  idPara(tarjetaId: string, anio: number, mes: number): string {
    return `${tarjetaId}-${anio}-${mes}`
  }
}

export const montosManualesRepository = new MontosManualesRepository()
