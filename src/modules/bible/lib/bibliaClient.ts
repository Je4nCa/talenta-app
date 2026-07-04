import type { ResultadoBusqueda, Versiculo } from '../types'

const BASE_URL = 'https://api.biblia.com/v1/bible'

export class BibliaApiError extends Error {}

function obtenerApiKey(): string {
  const key = import.meta.env.VITE_BIBLIA_API_KEY
  if (!key) {
    throw new BibliaApiError('Falta configurar la clave de la API de Biblia.com (VITE_BIBLIA_API_KEY).')
  }
  return key
}

function parsearVersiculos(texto: string): Versiculo[] {
  // La primera línea siempre es la cita (ej. "1 Corinthians 1 (RVR60)"), nunca un versículo.
  // Se descarta por posición, no por patrón: algunos libros empiezan con número
  // (1 Corintios, 2 Reyes...) y esa cita podría confundirse con un versículo real.
  const [, ...lineas] = texto.split(/\r?\n/).filter((linea) => linea.trim().length > 0)
  const versiculos: Versiculo[] = []

  for (const linea of lineas) {
    const coincidencia = linea.match(/^(\d+)\s*(.*)$/)
    if (coincidencia) {
      versiculos.push({ numero: Number(coincidencia[1]), texto: coincidencia[2].trim() })
    }
  }

  return versiculos
}

export async function obtenerCapitulo(
  bibliaId: string,
  referenciaLibro: string,
  capitulo: number,
): Promise<Versiculo[]> {
  const parametros = new URLSearchParams({
    passage: `${referenciaLibro} ${capitulo}`,
    key: obtenerApiKey(),
    style: 'oneVersePerLine',
  })

  const respuesta = await fetch(`${BASE_URL}/content/${bibliaId}.txt.json?${parametros}`)
  if (!respuesta.ok) {
    throw new BibliaApiError('No se pudo cargar el capítulo. Intenta de nuevo.')
  }

  const datos = (await respuesta.json()) as { text?: string }
  return parsearVersiculos(datos.text ?? '')
}

export async function buscarPalabra(
  bibliaId: string,
  consulta: string,
): Promise<ResultadoBusqueda[]> {
  const parametros = new URLSearchParams({
    query: consulta,
    mode: 'verse',
    limit: '25',
    preview: 'text',
    key: obtenerApiKey(),
  })

  const respuesta = await fetch(`${BASE_URL}/search/${bibliaId}.js?${parametros}`)
  if (!respuesta.ok) {
    throw new BibliaApiError('No se pudo realizar la búsqueda. Intenta de nuevo.')
  }

  const datos = (await respuesta.json()) as { results?: { title: string; preview: string }[] }
  return (datos.results ?? []).map((r) => ({ referencia: r.title, vistaPrevia: r.preview }))
}
