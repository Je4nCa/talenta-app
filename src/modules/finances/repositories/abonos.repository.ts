import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { AbonoTarjeta } from '../types'

class AbonosTarjetaRepository extends FirestoreRepository<AbonoTarjeta> {
  constructor() {
    super('abonosTarjeta')
  }

  async porTarjetaYPeriodo(uid: string, tarjetaId: string, anio: number, mes: number): Promise<AbonoTarjeta[]> {
    const todos = await this.obtenerTodos(uid)
    return todos.filter((a) => a.tarjetaId === tarjetaId && a.anio === anio && a.mes === mes)
  }
}

export const abonosTarjetaRepository = new AbonosTarjetaRepository()
