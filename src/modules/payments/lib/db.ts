import Dexie, { type Table } from 'dexie'
import type { Suscripcion } from '../types/suscripcion'

class PagosDB extends Dexie {
  suscripciones!: Table<Suscripcion>

  constructor() {
    super('talenta-payments-db')
    this.version(1).stores({
      suscripciones: 'id, uid, estado, creadoEn',
    })
  }
}

export const pagosDb = new PagosDB()
