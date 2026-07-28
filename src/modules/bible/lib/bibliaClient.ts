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

export async function obtenerPasaje(bibliaId: string, referenciaCompleta: string): Promise<string> {
  const parametros = new URLSearchParams({
    passage: referenciaCompleta,
    key: obtenerApiKey(),
  })

  const respuesta = await fetch(`${BASE_URL}/content/${bibliaId}.txt.json?${parametros}`)
  if (!respuesta.ok) {
    throw new BibliaApiError('No se pudo cargar el versículo. Intenta de nuevo.')
  }

  const datos = (await respuesta.json()) as { text?: string }
  return (datos.text ?? '').trim()
}

/** Minúsculas y sin tildes, para comparar "Corazón" con "corazon". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export async function buscarPalabra(
  bibliaId: string,
  consulta: string,
): Promise<ResultadoBusqueda[]> {
  const parametros = new URLSearchParams({
    query: consulta,
    mode: 'verse',
    // Se pide de más porque abajo se descartan los resultados irrelevantes
    // que devuelve el API; con 25 quedaban muy pocos útiles.
    limit: '50',
    preview: 'text',
    key: obtenerApiKey(),
  })

  const respuesta = await fetch(`${BASE_URL}/search/${bibliaId}.js?${parametros}`)
  if (!respuesta.ok) {
    throw new BibliaApiError('No se pudo realizar la búsqueda. Intenta de nuevo.')
  }

  const datos = (await respuesta.json()) as { results?: { title: string; preview: string }[] }
  const crudos = datos.results ?? []

  // El API mezcla resultados que **no contienen** lo buscado (devuelve el
  // versículo 1 de un capítulo relacionado) y repite referencias. Verificado
  // contra el servicio real: de 25 resultados para "amor", 7 no traían la
  // palabra y 1 venía duplicado. Se filtra y deduplica aquí.
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean)
  const vistas = new Set<string>()

  return crudos
    .filter((r) => {
      if (!r.title || !r.preview) return false
      if (vistas.has(r.title)) return false

      const texto = normalizar(r.preview)
      if (!palabras.every((palabra) => texto.includes(palabra))) return false

      vistas.add(r.title)
      return true
    })
    .map((r) => ({ referencia: r.title, vistaPrevia: r.preview }))
}
