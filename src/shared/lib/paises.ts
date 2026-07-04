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
