import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { Ingreso } from '../types'

class IngresosRepository extends FirestoreRepository<Ingreso> {
  constructor() {
    super('ingresos')
  }

  async obtenerPorPeriodo(uid: string, anio: number, mes: number): Promise<Ingreso[]> {
    const prefijo = `${anio}-${String(mes).padStart(2, '0')}`
    const todos = await this.obtenerTodos(uid)
    return todos.filter((i) => i.fecha.startsWith(prefijo))
  }
}

export const ingresosRepository = new IngresosRepository()
