import { PAISES } from '@/shared/lib/paises'

const SIMBOLOS_POR_MONEDA: Record<string, string> = Object.fromEntries(
  PAISES.map((pais) => [pais.monedaCodigo, pais.monedaSimbolo]),
)

export function formatearMonto(monto: number, monedaCodigo: string): string {
  const simbolo = SIMBOLOS_POR_MONEDA[monedaCodigo] ?? monedaCodigo
  try {
    // Locale 'es-CO' en vez del genérico 'es': el 'es' sin país tiene un bug
    // de ICU que omite el separador de miles para valores de 4 dígitos
    // (ej. formatea 8000 como "8000" en vez de "8.000"), pero sí lo aplica
    // desde 10.000 en adelante — inconsistencia confirmada probando varios
    // locales. 'es-CO' agrupa con punto de forma consistente en todo rango.
    const formateado = new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: monedaCodigo === 'CRC' ? 0 : 2,
    }).format(monto)
    return `${simbolo}${formateado}`
  } catch {
    return `${simbolo}${monto.toFixed(2)}`
  }
}

export const NOMBRES_MES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]
