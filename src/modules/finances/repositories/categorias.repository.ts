import { finanzasDB } from '../lib/db'
import { CATEGORIAS_SEMILLA } from '../constants/categorias'
import type { Categoria } from '../types'
import { BaseRepository } from './base.repository'

class CategoriasRepository extends BaseRepository<Categoria> {
  constructor() {
    super(finanzasDB.categorias)
  }

  async obtenerPorUsuario(uid: string): Promise<Categoria[]> {
    return this.tabla.where('uid').equals(uid).toArray()
  }

  /** Copia las categorías semilla para un usuario nuevo, solo si aún no tiene ninguna. */
  async sembrarSiNecesario(uid: string): Promise<void> {
    const existentes = await this.obtenerPorUsuario(uid)
    if (existentes.length > 0) return

    const ahora = new Date().toISOString()
    await this.tabla.bulkPut(
      CATEGORIAS_SEMILLA.map((semilla) => ({
        ...semilla,
        id: `${uid}-${semilla.id}`,
        uid,
        esPersonalizada: false,
        creadoEn: ahora,
      })),
    )
  }
}

export const categoriasRepository = new CategoriasRepository()
