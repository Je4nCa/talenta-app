import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { Gasto } from '../types'

class GastosRepository extends FirestoreRepository<Gasto> {
  constructor() {
    super('gastos')
  }

  async obtenerPorPeriodo(uid: string, anio: number, mes: number): Promise<Gasto[]> {
    const prefijo = `${anio}-${String(mes).padStart(2, '0')}`
    const todos = await this.obtenerTodos(uid)
    return todos.filter((g) => (g.fechaCobro ?? g.fecha).startsWith(prefijo))
  }
}

export const gastosRepository = new GastosRepository()
