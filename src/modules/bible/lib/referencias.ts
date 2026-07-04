import { LIBROS_BIBLIA, type LibroBiblia } from '../constants/libros'

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
 * Biblia elegida. Esto la convierte a los datos en español que usa la UI.
 */
export function parsearReferencia(referencia: string): ReferenciaParseada | null {
  const coincidencia = referencia.match(/^(.+)\s(\d+):(\d+)/)
  if (!coincidencia) return null

  const [, nombreLibro, capitulo, versiculo] = coincidencia
  const libro = buscarLibroPorNombre(nombreLibro)
  if (!libro) return null

  return { libro, capitulo: Number(capitulo), versiculo: Number(versiculo) }
}

/**
 * Traduce una referencia curada a mano (ej. "Proverbs 3:9-10") a su
 * versión en español ("Proverbios 3:9-10"), preservando rangos de versículo.
 */
export function formatearReferenciaEnEspanol(referencia: string): string {
  const coincidencia = referencia.match(/^(.+?)\s(\d+:[\d\-,\s]+)$/)
  if (!coincidencia) return referencia

  const [, nombreLibro, resto] = coincidencia
  const libro = buscarLibroPorNombre(nombreLibro)
  return libro ? `${libro.nombre} ${resto.trim()}` : referencia
}
