export function formatearMonto(monto: number, monedaCodigo: string): string {
  try {
    return new Intl.NumberFormat('es', {
      style: 'currency',
      currency: monedaCodigo,
      maximumFractionDigits: monedaCodigo === 'CRC' ? 0 : 2,
    }).format(monto)
  } catch {
    return `${monto.toFixed(2)} ${monedaCodigo}`
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
