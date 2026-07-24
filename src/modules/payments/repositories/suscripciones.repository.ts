import { pagosDb } from '../lib/db'
import type { Suscripcion } from '../types/suscripcion'

export const suscripcionesRepository = {
  async obtenerActualPorUsuario(uid: string): Promise<Suscripcion | undefined> {
    const todas = await pagosDb.suscripciones.where('uid').equals(uid).sortBy('creadoEn')
    return todas[todas.length - 1]
  },

  async crear(suscripcion: Suscripcion): Promise<void> {
    await pagosDb.suscripciones.add(suscripcion)
  },

  async actualizar(id: string, cambios: Partial<Suscripcion>): Promise<void> {
    await pagosDb.suscripciones.update(id, cambios)
  },
}
