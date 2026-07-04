import { finanzasDB } from '../lib/db'
import type { TarjetaCredito } from '../types'
import { BaseRepository } from './base.repository'

class TarjetasRepository extends BaseRepository<TarjetaCredito> {
  constructor() {
    super(finanzasDB.tarjetas)
  }
}

export const tarjetasRepository = new TarjetasRepository()
