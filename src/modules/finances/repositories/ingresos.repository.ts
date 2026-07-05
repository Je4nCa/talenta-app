import { finanzasDB } from '../lib/db'
import type { Ingreso } from '../types'
import { BaseRepository } from './base.repository'

class IngresosRepository extends BaseRepository<Ingreso> {
  constructor() {
    super(finanzasDB.ingresos)
  }

  async obtenerPorPeriodo(uid: string, anio: number, mes: number): Promise<Ingreso[]> {
    const prefijo = `${anio}-${String(mes).padStart(2, '0')}`
    const todos = await this.tabla.where('uid').equals(uid).toArray()
    return todos.filter((i) => i.fecha.startsWith(prefijo))
  }
}

export const ingresosRepository = new IngresosRepository()
