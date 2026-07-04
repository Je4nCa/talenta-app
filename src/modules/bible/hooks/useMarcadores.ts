import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { bibliaDB } from '../lib/db'
import type { VersiculoGuardado } from '../types'

export function useVersiculosGuardados() {
  const uid = useAuth((state) => state.usuario?.uid)

  const guardados = useLiveQuery(async () => {
    if (!uid) return []
    const todos = await bibliaDB.guardados.where('uid').equals(uid).toArray()
    return todos.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
  }, [uid])

  return { guardados: guardados ?? [], cargando: guardados === undefined }
}

export function useSubrayados(libro: string, capitulo: number) {
  const uid = useAuth((state) => state.usuario?.uid)

  const subrayados = useLiveQuery(async () => {
    if (!uid) return new Set<number>()
    const todos = await bibliaDB.subrayados.where('uid').equals(uid).toArray()
    return new Set(
      todos.filter((s) => s.libro === libro && s.capitulo === capitulo).map((s) => s.versiculo),
    )
  }, [uid, libro, capitulo])

  return subrayados ?? new Set<number>()
}

export async function alternarSubrayado(
  uid: string,
  bibliaId: string,
  libro: string,
  capitulo: number,
  versiculo: number,
): Promise<void> {
  const existente = await bibliaDB.subrayados
    .filter(
      (s) =>
        s.uid === uid && s.libro === libro && s.capitulo === capitulo && s.versiculo === versiculo,
    )
    .first()

  if (existente) {
    await bibliaDB.subrayados.delete(existente.id)
  } else {
    await bibliaDB.subrayados.add({
      id: crypto.randomUUID(),
      uid,
      bibliaId,
      libro,
      capitulo,
      versiculo,
      creadoEn: new Date().toISOString(),
    })
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
  const existente = await bibliaDB.guardados
    .filter(
      (g) =>
        g.uid === uid && g.libro === libro && g.capitulo === capitulo && g.versiculo === versiculo,
    )
    .first()

  if (existente) {
    await bibliaDB.guardados.delete(existente.id)
  } else {
    const nuevo: VersiculoGuardado = {
      id: crypto.randomUUID(),
      uid,
      bibliaId,
      libro,
      capitulo,
      versiculo,
      texto,
      creadoEn: new Date().toISOString(),
    }
    await bibliaDB.guardados.add(nuevo)
  }
}

export async function estaGuardado(
  uid: string,
  libro: string,
  capitulo: number,
  versiculo: number,
): Promise<boolean> {
  const existente = await bibliaDB.guardados
    .filter(
      (g) =>
        g.uid === uid && g.libro === libro && g.capitulo === capitulo && g.versiculo === versiculo,
    )
    .first()
  return Boolean(existente)
}
