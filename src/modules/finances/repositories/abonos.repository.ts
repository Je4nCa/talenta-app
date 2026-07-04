import { finanzasDB } from '../lib/db'
import type { AbonoTarjeta } from '../types'
import { BaseRepository } from './base.repository'

class AbonosTarjetaRepository extends BaseRepository<AbonoTarjeta> {
  constructor() {
    super(finanzasDB.abonosTarjeta)
  }

  async porTarjetaYPeriodo(tarjetaId: string, anio: number, mes: number): Promise<AbonoTarjeta[]> {
    const todos = await this.tabla.where('tarjetaId').equals(tarjetaId).toArray()
    return todos.filter((a) => a.anio === anio && a.mes === mes)
  }
}

export const abonosTarjetaRepository = new AbonosTarjetaRepository()
