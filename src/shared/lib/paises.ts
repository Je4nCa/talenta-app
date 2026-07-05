export interface Pais {
  codigo: string
  nombre: string
  monedaCodigo: string
  monedaNombre: string
  monedaSimbolo: string
}

export const PAISES: Pais[] = [
  { codigo: 'CR', nombre: 'Costa Rica', monedaCodigo: 'CRC', monedaNombre: 'Colón costarricense', monedaSimbolo: '₡' },
  { codigo: 'GT', nombre: 'Guatemala', monedaCodigo: 'GTQ', monedaNombre: 'Quetzal', monedaSimbolo: 'Q' },
  { codigo: 'HN', nombre: 'Honduras', monedaCodigo: 'HNL', monedaNombre: 'Lempira', monedaSimbolo: 'L' },
  { codigo: 'SV', nombre: 'El Salvador', monedaCodigo: 'USD', monedaNombre: 'Dólar estadounidense', monedaSimbolo: '$' },
  { codigo: 'NI', nombre: 'Nicaragua', monedaCodigo: 'NIO', monedaNombre: 'Córdoba', monedaSimbolo: 'C$' },
  { codigo: 'PA', nombre: 'Panamá', monedaCodigo: 'USD', monedaNombre: 'Dólar estadounidense', monedaSimbolo: '$' },
  { codigo: 'MX', nombre: 'México', monedaCodigo: 'MXN', monedaNombre: 'Peso mexicano', monedaSimbolo: '$' },
  { codigo: 'CO', nombre: 'Colombia', monedaCodigo: 'COP', monedaNombre: 'Peso colombiano', monedaSimbolo: '$' },
  { codigo: 'VE', nombre: 'Venezuela', monedaCodigo: 'VES', monedaNombre: 'Bolívar', monedaSimbolo: 'Bs' },
  { codigo: 'EC', nombre: 'Ecuador', monedaCodigo: 'USD', monedaNombre: 'Dólar estadounidense', monedaSimbolo: '$' },
  { codigo: 'PE', nombre: 'Perú', monedaCodigo: 'PEN', monedaNombre: 'Sol', monedaSimbolo: 'S/' },
  { codigo: 'CL', nombre: 'Chile', monedaCodigo: 'CLP', monedaNombre: 'Peso chileno', monedaSimbolo: '$' },
  { codigo: 'AR', nombre: 'Argentina', monedaCodigo: 'ARS', monedaNombre: 'Peso argentino', monedaSimbolo: '$' },
  { codigo: 'DO', nombre: 'República Dominicana', monedaCodigo: 'DOP', monedaNombre: 'Peso dominicano', monedaSimbolo: 'RD$' },
  { codigo: 'US', nombre: 'Estados Unidos', monedaCodigo: 'USD', monedaNombre: 'Dólar estadounidense', monedaSimbolo: '$' },
  { codigo: 'ES', nombre: 'España', monedaCodigo: 'EUR', monedaNombre: 'Euro', monedaSimbolo: '€' },
]

export function buscarPais(codigo: string): Pais | undefined {
  return PAISES.find((pais) => pais.codigo === codigo)
}

export interface Moneda {
  codigo: string
  nombre: string
  simbolo: string
  /** País representativo de esta moneda, usado solo para mostrar su bandera. */
  paisCodigo: string
}

/**
 * Varios países comparten una misma moneda (ej. USD lo usan El Salvador,
 * Panamá, Ecuador y EE. UU.) — para esos casos se elige a mano el país
 * "representativo" cuya bandera se muestra junto al nombre de la moneda.
 */
const PAIS_REPRESENTATIVO_POR_MONEDA: Record<string, string> = {
  USD: 'US',
}

/**
 * Lista de monedas únicas (varios países comparten moneda, ej. USD),
 * derivada de PAISES para el selector manual de moneda en Perfil.
 */
export const MONEDAS: Moneda[] = Array.from(
  new Map(
    PAISES.map((pais) => [
      pais.monedaCodigo,
      {
        codigo: pais.monedaCodigo,
        nombre: pais.monedaNombre,
        simbolo: pais.monedaSimbolo,
        paisCodigo: PAIS_REPRESENTATIVO_POR_MONEDA[pais.monedaCodigo] ?? pais.codigo,
      },
    ]),
  ).values(),
)

export function buscarMoneda(codigo: string): Moneda | undefined {
  return MONEDAS.find((moneda) => moneda.codigo === codigo)
}

const BASE_INDICADOR_REGIONAL = 0x1f1e6
const CODIGO_A = 'A'.charCodeAt(0)

/** Convierte un código ISO 3166-1 alpha-2 (ej. "CR") a su emoji de bandera (🇨🇷). */
export function emojiDeBandera(codigo: string): string {
  return [...codigo.toUpperCase()]
    .map((letra) => String.fromCodePoint(BASE_INDICADOR_REGIONAL + letra.charCodeAt(0) - CODIGO_A))
    .join('')
}
