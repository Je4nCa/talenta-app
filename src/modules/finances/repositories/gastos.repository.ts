import { finanzasDB } from '../lib/db'
import type { Gasto } from '../types'
import { BaseRepository } from './base.repository'

class GastosRepository extends BaseRepository<Gasto> {
  constructor() {
    super(finanzasDB.gastos)
  }

  async obtenerPorPeriodo(uid: string, anio: number, mes: number): Promise<Gasto[]> {
    const prefijo = `${anio}-${String(mes).padStart(2, '0')}`
    const todos = await this.tabla.where('uid').equals(uid).toArray()
    return todos.filter((g) => (g.fechaCobro ?? g.fecha).startsWith(prefijo))
  }
}

export const gastosRepository = new GastosRepository()
