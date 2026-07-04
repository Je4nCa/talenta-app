import type { FechaHoraISO } from './comunes'

export enum TipoCategoria {
  Egreso = 'egreso',
  Ingreso = 'ingreso',
  Neutro = 'neutro',
}

/** Antes era una unión fija de 12 ids; ahora el usuario puede crear las suyas. */
export type CategoriaId = string

export interface Categoria {
  id: CategoriaId
  uid: string
  nombre: string
  emoji: string
  color: string
  tipo: TipoCategoria
  /** % recomendado del ingreso a destinar a esta categoría (educación financiera). */
  porcentajeRecomendado?: number
  /** false para las 12 categorías semilla; true para las que crea el usuario. */
  esPersonalizada: boolean
  creadoEn: FechaHoraISO
}
