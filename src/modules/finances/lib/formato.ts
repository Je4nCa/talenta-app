const ESPACIO_SIN_SEPARACION = String.fromCharCode(160)

export function formatearMonto(monto: number, monedaCodigo: string): string {
  try {
    const formateado = new Intl.NumberFormat('es', {
      style: 'currency',
      currency: monedaCodigo,
      maximumFractionDigits: monedaCodigo === 'CRC' ? 0 : 2,
    }).format(monto)
    // Intl separa el símbolo del número con un espacio de no separación;
    // lo cambiamos por uno normal para que el texto pueda partirse ahí en
    // tarjetas angostas, en vez de partirse a la mitad de un número o del
    // código de moneda.
    return formateado.split(ESPACIO_SIN_SEPARACION).join(' ')
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
