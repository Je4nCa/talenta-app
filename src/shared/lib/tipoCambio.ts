/**
 * Tipos de cambio para mostrar un aproximado cuando el usuario maneja dos
 * monedas (ej. colones y dólares).
 *
 * Fuente: open.er-api.com — pública, gratuita, sin API key y con una
 * actualización diaria. Cubre las 13 monedas de `paises.ts`.
 *
 * Las tasas se guardan en `localStorage` y solo se vuelven a pedir cuando
 * cambia el día: así la app no depende de la red para pintar montos ya
 * registrados, y sigue funcionando sin conexión con la última tasa conocida.
 *
 * **Es un aproximado**, no una conversión contable: el tipo de cambio real de
 * un banco o una tarjeta difiere. La UI debe dejarlo claro.
 */

const URL_API = 'https://open.er-api.com/v6/latest/USD'
const CLAVE_CACHE = 'talenta:tipo-cambio'

/** Tasas por USD (1 USD = N unidades de esa moneda). */
export interface TasasCambio {
  /** YYYY-MM-DD del día en que se pidieron. */
  fecha: string
  porUsd: Record<string, number>
}

interface RespuestaApi {
  result?: string
  rates?: Record<string, number>
}

function hoy(): string {
  return new Date().toISOString().slice(0, 10)
}

function leerCache(): TasasCambio | null {
  try {
    const crudo = localStorage.getItem(CLAVE_CACHE)
    if (!crudo) return null
    const datos = JSON.parse(crudo) as TasasCambio
    return datos?.porUsd && datos?.fecha ? datos : null
  } catch {
    return null
  }
}

function guardarCache(tasas: TasasCambio): void {
  try {
    localStorage.setItem(CLAVE_CACHE, JSON.stringify(tasas))
  } catch {
    // Sin espacio o modo privado: seguimos con las tasas en memoria.
  }
}

/**
 * Devuelve las tasas del día. Si ya se pidieron hoy usa la caché; si la
 * petición falla, cae a la última tasa conocida (aunque sea de días
 * anteriores) antes que dejar la app sin poder convertir.
 */
export async function obtenerTasas(): Promise<TasasCambio | null> {
  const cache = leerCache()
  if (cache && cache.fecha === hoy()) return cache

  try {
    const respuesta = await fetch(URL_API)
    if (!respuesta.ok) throw new Error('respuesta no OK')
    const datos = (await respuesta.json()) as RespuestaApi
    if (datos.result !== 'success' || !datos.rates) throw new Error('formato inesperado')

    const tasas: TasasCambio = { fecha: hoy(), porUsd: datos.rates }
    guardarCache(tasas)
    return tasas
  } catch {
    return cache
  }
}

/**
 * Convierte entre dos monedas usando USD como puente. Devuelve `null` si no
 * hay tasa para alguna de las dos (así quien llama decide qué mostrar en vez
 * de inventar un número).
 */
export function convertir(
  monto: number,
  desde: string,
  hacia: string,
  tasas: TasasCambio | null,
): number | null {
  if (desde === hacia) return monto
  if (!tasas) return null

  const tasaDesde = tasas.porUsd[desde]
  const tasaHacia = tasas.porUsd[hacia]
  if (!tasaDesde || !tasaHacia) return null

  return (monto / tasaDesde) * tasaHacia
}
