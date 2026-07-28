import { useEffect } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import { categoriasRepository } from '../repositories'
import type { Categoria } from '../types'

export function useCategorias() {
  const uid = useAuth((state) => state.usuario?.uid)

  useEffect(() => {
    if (uid) categoriasRepository.sembrarSiNecesario(uid)
  }, [uid])

  const { datos: sinOrdenar, cargando } = useColeccionUsuario<Categoria>(uid, 'categorias')
  const categorias = [...sinOrdenar].sort((a, b) => a.nombre.localeCompare(b.nombre))

  const mapa: Record<string, Categoria> = Object.fromEntries(categorias.map((c) => [c.id, c]))

  return { categorias, mapa, cargando }
}
