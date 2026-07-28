import { deleteDoc, doc, runTransaction } from 'firebase/firestore'
import { firestore } from '@/shared/lib/firebase'
import { FirestoreRepository } from '@/shared/lib/firestoreRepository'
import type { AbonoDeuda } from '../types'

class AbonosDeudaRepository extends FirestoreRepository<AbonoDeuda> {
  constructor() {
    super('abonosDeuda')
  }

  async porDeuda(uid: string, deudaId: string): Promise<AbonoDeuda[]> {
    const todos = await this.obtenerTodos(uid)
    return todos.filter((a) => a.deudaId === deudaId)
  }

  /** Registra el abono y descuenta el monto del saldo de la deuda en una sola transacción. */
  async registrarAbono(deudaId: string, uid: string, monto: number, fecha: string): Promise<void> {
    const refDeuda = doc(firestore, 'users', uid, 'deudas', deudaId)
    const refAbono = this.docRef(uid, crypto.randomUUID())

    await runTransaction(firestore, async (tx) => {
      const deudaSnap = await tx.get(refDeuda)

      tx.set(refAbono, {
        id: refAbono.id,
        deudaId,
        uid,
        monto,
        fecha,
        creadoEn: new Date().toISOString(),
      })

      if (deudaSnap.exists()) {
        const saldoActual = deudaSnap.data().saldoActual as number
        tx.update(refDeuda, {
          saldoActual: Math.max(0, saldoActual - monto),
          actualizadoEn: new Date().toISOString(),
        })
      }
    })
  }

  async eliminarPorDeuda(uid: string, deudaId: string): Promise<void> {
    const abonos = await this.porDeuda(uid, deudaId)
    await Promise.all(abonos.map((a) => deleteDoc(this.docRef(uid, a.id))))
  }
}

export const abonosDeudaRepository = new AbonosDeudaRepository()
