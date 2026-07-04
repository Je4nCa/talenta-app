import type { Table, UpdateSpec } from 'dexie'
import type { ID } from '../types'

export class BaseRepository<T extends { id: ID }> {
  constructor(protected readonly tabla: Table<T, ID>) {}

  async obtenerPorId(id: ID): Promise<T | undefined> {
    return this.tabla.get(id)
  }

  async obtenerTodos(): Promise<T[]> {
    return this.tabla.toArray()
  }

  async crear(item: T): Promise<void> {
    await this.tabla.put(item)
  }

  async crearBulk(items: T[]): Promise<void> {
    await this.tabla.bulkPut(items)
  }

  async actualizar(id: ID, cambios: Partial<T>): Promise<void> {
    await this.tabla.update(id, cambios as UpdateSpec<T>)
  }

  async eliminar(id: ID): Promise<void> {
    await this.tabla.delete(id)
  }

  async contar(): Promise<number> {
    return this.tabla.count()
  }
}
