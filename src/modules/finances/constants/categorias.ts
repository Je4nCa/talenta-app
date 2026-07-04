import { TipoCategoria } from '../types/categoria'

/**
 * Semilla: se copian a la tabla `categorias` de Dexie (con su propio `uid`)
 * la primera vez que un usuario abre Finanzas. A partir de ahí viven en la
 * base de datos como cualquier categoría — el usuario puede editarlas o
 * borrarlas igual que las que él mismo crea.
 */
export const CATEGORIAS_SEMILLA: {
  id: string
  nombre: string
  emoji: string
  color: string
  tipo: TipoCategoria
  porcentajeRecomendado?: number
}[] = [
  { id: 'comida', nombre: 'Comida', emoji: '🍔', color: '#f97316', tipo: TipoCategoria.Egreso, porcentajeRecomendado: 15 },
  { id: 'apartamento', nombre: 'Apartamento', emoji: '🏠', color: '#6366f1', tipo: TipoCategoria.Egreso, porcentajeRecomendado: 30 },
  { id: 'cafe', nombre: 'Café', emoji: '☕', color: '#92400e', tipo: TipoCategoria.Egreso },
  { id: 'compras', nombre: 'Compras', emoji: '🛍️', color: '#ec4899', tipo: TipoCategoria.Egreso, porcentajeRecomendado: 5 },
  { id: 'transporte', nombre: 'Transporte', emoji: '🚗', color: '#3b82f6', tipo: TipoCategoria.Egreso, porcentajeRecomendado: 10 },
  { id: 'salud', nombre: 'Salud', emoji: '💊', color: '#10b981', tipo: TipoCategoria.Egreso, porcentajeRecomendado: 5 },
  { id: 'entretenimiento', nombre: 'Entretenimiento', emoji: '🎬', color: '#8b5cf6', tipo: TipoCategoria.Egreso, porcentajeRecomendado: 5 },
  { id: 'suscripciones', nombre: 'Suscripciones', emoji: '📱', color: '#06b6d4', tipo: TipoCategoria.Egreso },
  { id: 'viajes', nombre: 'Viajes', emoji: '✈️', color: '#f59e0b', tipo: TipoCategoria.Egreso },
  { id: 'educacion', nombre: 'Educación', emoji: '📚', color: '#84cc16', tipo: TipoCategoria.Egreso },
  { id: 'mascotas', nombre: 'Mascotas', emoji: '🐾', color: '#f472b6', tipo: TipoCategoria.Egreso },
  { id: 'otros', nombre: 'Otros', emoji: '📦', color: '#6b7280', tipo: TipoCategoria.Neutro },
]
