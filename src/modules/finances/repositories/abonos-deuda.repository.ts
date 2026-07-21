import { finanzasDB } from '../lib/db'
import type { AbonoDeuda } from '../types'
import { BaseRepository } from './base.repository'

class AbonosDeudaRepository extends BaseRepository<AbonoDeuda> {
  constructor() {
    super(finanzasDB.abonosDeuda)
  }

  async porDeuda(deudaId: string): Promise<AbonoDeuda[]> {
    return this.tabla.where('deudaId').equals(deudaId).toArray()
  }

  /** Registra el abono y descuenta el monto del saldo de la deuda en una sola transacción. */
  async registrarAbono(deudaId: string, uid: string, monto: number, fecha: string): Promise<void> {
    await finanzasDB.transaction('rw', finanzasDB.abonosDeuda, finanzasDB.deudas, async () => {
      await this.tabla.add({
        id: crypto.randomUUID(),
        deudaId,
        uid,
        monto,
        fecha,
        creadoEn: new Date().toISOString(),
      })

      const deuda = await finanzasDB.deudas.get(deudaId)
      if (deuda) {
        await finanzasDB.deudas.update(deudaId, {
          saldoActual: Math.max(0, deuda.saldoActual - monto),
          actualizadoEn: new Date().toISOString(),
        })
      }
    })
  }

  async eliminarPorDeuda(deudaId: string): Promise<void> {
    const abonos = await this.porDeuda(deudaId)
    await this.tabla.bulkDelete(abonos.map((a) => a.id))
  }
}

export const abonosDeudaRepository = new AbonosDeudaRepository()
