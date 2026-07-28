import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
  type UpdateData,
} from 'firebase/firestore'
import { firestore } from './firebase'

/**
 * Repositorio genérico sobre Firestore, bajo `users/{uid}/{coleccion}/{id}` —
 * mismo contrato que el viejo `BaseRepository` sobre Dexie
 * (`obtenerPorId/obtenerTodos/crear/crearBulk/actualizar/eliminar/contar`),
 * para que los repositorios concretos de cada módulo cambien de
 * implementación sin que hooks/componentes se enteren.
 */
export class FirestoreRepository<T extends { id: string; uid: string }> {
  constructor(protected readonly nombreColeccion: string) {}

  protected coleccion(uid: string) {
    return collection(firestore, 'users', uid, this.nombreColeccion)
  }

  protected docRef(uid: string, id: string) {
    return doc(firestore, 'users', uid, this.nombreColeccion, id)
  }

  async obtenerPorId(uid: string, id: string): Promise<T | undefined> {
    const snap = await getDoc(this.docRef(uid, id))
    return snap.exists() ? (snap.data() as T) : undefined
  }

  async obtenerTodos(uid: string): Promise<T[]> {
    const snap = await getDocs(this.coleccion(uid))
    return snap.docs.map((d) => d.data() as T)
  }

  async crear(item: T): Promise<void> {
    await setDoc(this.docRef(item.uid, item.id), item)
  }

  async crearBulk(items: T[]): Promise<void> {
    if (items.length === 0) return
    const batch = writeBatch(firestore)
    for (const item of items) {
      batch.set(this.docRef(item.uid, item.id), item)
    }
    await batch.commit()
  }

  async actualizar(uid: string, id: string, cambios: Partial<T>): Promise<void> {
    await updateDoc(this.docRef(uid, id), cambios as UpdateData<T>)
  }

  async eliminar(uid: string, id: string): Promise<void> {
    await deleteDoc(this.docRef(uid, id))
  }

  async contar(uid: string): Promise<number> {
    const snap = await getCountFromServer(this.coleccion(uid))
    return snap.data().count
  }
}
