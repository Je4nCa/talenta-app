import { finanzasDB } from '../lib/db'
import type { CuotaMensual, EstadoCuota, PlanCuotas } from '../types'
import { BaseRepository } from './base.repository'

class PlanesCuotasRepository extends BaseRepository<PlanCuotas> {
  constructor() {
    super(finanzasDB.planesCuotas)
  }
}

class CuotasMensualesRepository extends BaseRepository<CuotaMensual> {
  constructor() {
    super(finanzasDB.cuotasMensuales)
  }

  async porPlan(planCuotasId: string): Promise<CuotaMensual[]> {
    return this.tabla.where('planCuotasId').equals(planCuotasId).toArray()
  }

  async actualizarEstado(id: string, estado: EstadoCuota): Promise<void> {
    await this.tabla.update(id, { estado })
  }

  async eliminarPorPlan(planCuotasId: string): Promise<void> {
    const cuotas = await this.porPlan(planCuotasId)
    await this.tabla.bulkDelete(cuotas.map((c) => c.id))
  }
}

export const planesCuotasRepository = new PlanesCuotasRepository()
export const cuotasMensualesRepository = new CuotasMensualesRepository()
