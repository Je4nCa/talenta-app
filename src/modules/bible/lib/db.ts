import Dexie, { type Table } from 'dexie'
import type { VersiculoGuardado, VersiculoSubrayado } from '../types'

class BibliaDB extends Dexie {
  guardados!: Table<VersiculoGuardado>
  subrayados!: Table<VersiculoSubrayado>

  constructor() {
    super('talenta-biblia-db')
    this.version(1).stores({
      guardados: 'id, uid, [libro+capitulo], creadoEn',
      subrayados: 'id, uid, [libro+capitulo+versiculo]',
    })
  }
}

export const bibliaDB = new BibliaDB()
