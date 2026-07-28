import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { firestore } from '@/shared/lib/firebase'
import type { VersiculoGuardado, VersiculoSubrayado } from '../types'

/** Determinístico: no hace falta query, cada versículo tiene un único doc por usuario. */
function idVersiculo(libro: string, capitulo: number, versiculo: number): string {
  return `${libro}-${capitulo}-${versiculo}`
}

export function useVersiculosGuardados() {
  const uid = useAuth((state) => state.usuario?.uid)
  const [guardados, setGuardados] = useState<VersiculoGuardado[] | undefined>(undefined)

  useEffect(() => {
    if (!uid) {
      setGuardados([])
      return
    }
    const unsub = onSnapshot(collection(firestore, 'users', uid, 'guardados'), (snap) => {
      const todos = snap.docs.map((d) => d.data() as VersiculoGuardado)
      setGuardados(todos.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)))
    })
    return unsub
  }, [uid])

  return { guardados: guardados ?? [], cargando: guardados === undefined }
}

export function useSubrayados(libro: string, capitulo: number) {
  const uid = useAuth((state) => state.usuario?.uid)
  const [subrayados, setSubrayados] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!uid) {
      setSubrayados(new Set())
      return
    }
    const unsub = onSnapshot(collection(firestore, 'users', uid, 'subrayados'), (snap) => {
      const todos = snap.docs.map((d) => d.data() as VersiculoSubrayado)
      setSubrayados(
        new Set(
          todos.filter((s) => s.libro === libro && s.capitulo === capitulo).map((s) => s.versiculo),
        ),
      )
    })
    return unsub
  }, [uid, libro, capitulo])

  return subrayados
}

export async function alternarSubrayado(
  uid: string,
  bibliaId: string,
  libro: string,
  capitulo: number,
  versiculo: number,
): Promise<void> {
  const ref = doc(firestore, 'users', uid, 'subrayados', idVersiculo(libro, capitulo, versiculo))
  const snap = await getDoc(ref)

  if (snap.exists()) {
    await deleteDoc(ref)
  } else {
    const nuevo: VersiculoSubrayado = {
      id: ref.id,
      uid,
      bibliaId,
      libro,
      capitulo,
      versiculo,
      creadoEn: new Date().toISOString(),
    }
    await setDoc(ref, nuevo)
  }
}

export async function alternarGuardado(
  uid: string,
  bibliaId: string,
  libro: string,
  capitulo: number,
  versiculo: number,
  texto: string,
): Promise<void> {
  const ref = doc(firestore, 'users', uid, 'guardados', idVersiculo(libro, capitulo, versiculo))
  const snap = await getDoc(ref)

  if (snap.exists()) {
    await deleteDoc(ref)
  } else {
    const nuevo: VersiculoGuardado = {
      id: ref.id,
      uid,
      bibliaId,
      libro,
      capitulo,
      versiculo,
      texto,
      creadoEn: new Date().toISOString(),
    }
    await setDoc(ref, nuevo)
  }
}

export async function estaGuardado(
  uid: string,
  libro: string,
  capitulo: number,
  versiculo: number,
): Promise<boolean> {
  const snap = await getDoc(doc(firestore, 'users', uid, 'guardados', idVersiculo(libro, capitulo, versiculo)))
  return snap.exists()
}
