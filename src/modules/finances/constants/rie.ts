import { CategoriaRIE } from '../types/rie'

/** Orden y etiquetas exactas de las columnas del formulario "Registro de Ingresos y Egresos (RIE)" del manual del estudiante. */
export const CATEGORIAS_RIE_ORDENADAS: { categoria: CategoriaRIE; etiqueta: string }[] = [
  { categoria: CategoriaRIE.IngresosSalario, etiqueta: 'Ingresos / salario' },
  { categoria: CategoriaRIE.Donaciones, etiqueta: 'Donaciones' },
  { categoria: CategoriaRIE.Impuestos, etiqueta: 'Impuestos' },
  { categoria: CategoriaRIE.Ahorros, etiqueta: 'Ahorros' },
  { categoria: CategoriaRIE.Vivienda, etiqueta: 'Vivienda' },
  { categoria: CategoriaRIE.Alimentos, etiqueta: 'Alimentos' },
  { categoria: CategoriaRIE.Servicios, etiqueta: 'Servicios' },
  { categoria: CategoriaRIE.Transporte, etiqueta: 'Transporte' },
  { categoria: CategoriaRIE.RopaOtros, etiqueta: 'Ropa / otros' },
  { categoria: CategoriaRIE.MedicoSalud, etiqueta: 'Med. / Salud' },
  { categoria: CategoriaRIE.Educacion, etiqueta: 'Educación' },
  { categoria: CategoriaRIE.Entretenimiento, etiqueta: 'Entretenimiento' },
  { categoria: CategoriaRIE.Personal, etiqueta: 'Personal' },
  { categoria: CategoriaRIE.Deudas, etiqueta: 'Deudas' },
  { categoria: CategoriaRIE.Otros, etiqueta: 'Otros' },
]

/** El manual usa una cuadrícula de 31 filas (días del mes). */
export const DIAS_RIE = 31
