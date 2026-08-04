import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/shared/lib/firebase'
import { generarId } from '@/shared/lib/id'
import type { Feedback } from '../types/feedback'

const COLECCION = 'feedback'

export async function guardarFeedback(
  datos: Omit<Feedback, 'id' | 'creadoEn'>,
): Promise<void> {
  const id = generarId()
  const registro: Feedback = { ...datos, id, creadoEn: new Date().toISOString() }
  await setDoc(doc(firestore, COLECCION, id), registro)
}

export async function marcarFeedbackLeido(id: string, leido: boolean): Promise<void> {
  await updateDoc(doc(firestore, COLECCION, id), { leido })
}

export function coleccionFeedback() {
  return collection(firestore, COLECCION)
}
