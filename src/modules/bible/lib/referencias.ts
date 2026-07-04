import { LIBROS_BIBLIA, type LibroBiblia } from '../constants/libros'
import { BIBLIAS_DISPONIBLES } from '../constants/biblias'
import { NOMBRES_LIBROS_POR_IDIOMA } from '../constants/nombresLibrosPorIdioma'

export interface ReferenciaParseada {
  libro: LibroBiblia
  capitulo: number
  versiculo: number
}

/** El API a veces usa nombres alternos al canónico que usamos en libros.ts. */
const ALIAS_LIBRO: Record<string, string> = {
  Psalm: 'Psalms',
  'Song of Solomon': 'Song of Songs',
}

function buscarLibroPorNombre(nombreLibro: string): LibroBiblia | undefined {
  const nombre = nombreLibro.trim()
  return LIBROS_BIBLIA.find(
    (l) => l.referencia === nombre || l.referencia === ALIAS_LIBRO[nombre],
  )
}

/**
 * El API de Biblia.com siempre devuelve la referencia con el nombre del libro
 * en inglés canónico (ej. "1 Corinthians 13:1"), sin importar el idioma de la
 * Biblia elegida. Esto la interpreta en un LibroBiblia + capítulo + versículo,
 * listo para mostrarse en el idioma que corresponda con nombreLibroLocalizado().
 */
export function parsearReferencia(referencia: string): ReferenciaParseada | null {
  const coincidencia = referencia.match(/^(.+)\s(\d+):(\d+)/)
  if (!coincidencia) return null

  const [, nombreLibro, capitulo, versiculo] = coincidencia
  const libro = buscarLibroPorNombre(nombreLibro)
  if (!libro) return null

  return { libro, capitulo: Number(capitulo), versiculo: Number(versiculo) }
}

/** Idioma (según BIBLIAS_DISPONIBLES) de una Biblia dada; español si no se reconoce. */
export function obtenerIdiomaDeBiblia(bibliaId: string): string {
  return BIBLIAS_DISPONIBLES.find((b) => b.id === bibliaId)?.idioma ?? 'Español'
}

/** Nombre de un libro en el idioma de la Biblia activa (cae a español si falta). */
export function nombreLibroLocalizado(libro: LibroBiblia, idioma: string): string {
  return NOMBRES_LIBROS_POR_IDIOMA[idioma]?.[libro.orden - 1] ?? libro.nombre
}

/**
 * Traduce una referencia curada a mano (ej. "Proverbs 3:9-10") al idioma de la
 * Biblia activa ("Proverbios 3:9-10" en español, "Proverbs 3:9-10" en inglés...),
 * preservando rangos de versículo.
 */
export function formatearReferenciaLocalizada(referencia: string, idioma: string): string {
  const coincidencia = referencia.match(/^(.+?)\s(\d+:[\d\-,\s]+)$/)
  if (!coincidencia) return referencia

  const [, nombreLibro, resto] = coincidencia
  const libro = buscarLibroPorNombre(nombreLibro)
  return libro ? `${nombreLibroLocalizado(libro, idioma)} ${resto.trim()}` : referencia
}
