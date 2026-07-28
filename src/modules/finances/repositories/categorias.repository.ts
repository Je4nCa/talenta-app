import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import { CATEGORIAS_SEMILLA } from '../constants/categorias'
import type { Categoria } from '../types'

class CategoriasRepository extends FirestoreRepository<Categoria> {
  constructor() {
    super('categorias')
  }

  async obtenerPorUsuario(uid: string): Promise<Categoria[]> {
    return this.obtenerTodos(uid)
  }

  /** Copia las categorías semilla para un usuario nuevo, solo si aún no tiene ninguna. */
  async sembrarSiNecesario(uid: string): Promise<void> {
    const existentes = await this.obtenerPorUsuario(uid)
    if (existentes.length > 0) return

    const ahora = new Date().toISOString()
    await this.crearBulk(
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
