export enum TipoCategoria {
  Egreso = 'egreso',
  Ingreso = 'ingreso',
  Neutro = 'neutro',
}

export type CategoriaId =
  | 'comida'
  | 'apartamento'
  | 'cafe'
  | 'compras'
  | 'transporte'
  | 'salud'
  | 'entretenimiento'
  | 'suscripciones'
  | 'viajes'
  | 'educacion'
  | 'mascotas'
  | 'otros'

export interface Categoria {
  id: CategoriaId
  nombre: string
  emoji: string
  color: string
  tipo: TipoCategoria
}
