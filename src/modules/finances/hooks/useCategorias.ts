import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { finanzasDB } from '../lib/db'
import { categoriasRepository } from '../repositories'
import type { Categoria } from '../types'

export function useCategorias() {
  const uid = useAuth((state) => state.usuario?.uid)

  useEffect(() => {
    if (uid) categoriasRepository.sembrarSiNecesario(uid)
  }, [uid])

  const categorias = useLiveQuery(async () => {
    if (!uid) return []
    const todas = await finanzasDB.categorias.where('uid').equals(uid).toArray()
    return todas.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [uid])

  const mapa: Record<string, Categoria> = Object.fromEntries(
    (categorias ?? []).map((c) => [c.id, c]),
  )

  return { categorias: categorias ?? [], mapa, cargando: categorias === undefined }
}
