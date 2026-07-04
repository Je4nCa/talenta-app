import { finanzasDB } from '../lib/db'
import type { Salario } from '../types'
import { BaseRepository } from './base.repository'

class SalariosRepository extends BaseRepository<Salario> {
  constructor() {
    super(finanzasDB.salarios)
  }

  async porPeriodo(uid: string, anio: number, mes: number): Promise<Salario[]> {
    const todos = await this.tabla.where('uid').equals(uid).toArray()
    return todos.filter((s) => s.anio === anio && s.mes === mes)
  }
}

export const salariosRepository = new SalariosRepository()
