import { finanzasDB } from '../lib/db'
import type { Deuda } from '../types'
import { BaseRepository } from './base.repository'

class DeudasRepository extends BaseRepository<Deuda> {
  constructor() {
    super(finanzasDB.deudas)
  }
}

export const deudasRepository = new DeudasRepository()
