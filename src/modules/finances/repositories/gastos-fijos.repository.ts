import { finanzasDB } from '../lib/db'
import type { GastoFijo } from '../types'
import { BaseRepository } from './base.repository'

class GastosFijosRepository extends BaseRepository<GastoFijo> {
  constructor() {
    super(finanzasDB.gastosFijos)
  }
}

export const gastosFijosRepository = new GastosFijosRepository()
