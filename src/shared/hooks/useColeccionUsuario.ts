import { collection, onSnapshot, type DocumentData } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { firestore } from '../lib/firebase'

/**
 * Suscripción reactiva a `users/{uid}/{coleccion}` — equivalente a
 * `useLiveQuery` de Dexie, pero contra Firestore (`onSnapshot`, se
 * actualiza solo cuando cambian los datos, sin refetch manual).
 */
export function useColeccionUsuario<T extends DocumentData>(
  uid: string | undefined,
  nombreColeccion: string,
): { datos: T[]; cargando: boolean } {
  const [datos, setDatos] = useState<T[] | undefined>(undefined)

  useEffect(() => {
    if (!uid) {
      setDatos([])
      return
    }
    setDatos(undefined)
    const unsub = onSnapshot(collection(firestore, 'users', uid, nombreColeccion), (snap) => {
      setDatos(snap.docs.map((d) => d.data() as T))
    })
    return unsub
  }, [uid, nombreColeccion])

  return { datos: datos ?? [], cargando: datos === undefined }
}
