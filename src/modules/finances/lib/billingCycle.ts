/**
 * Calcula el período de facturación de una tarjeta de crédito para un mes de
 * pago dado. Ej: diaCierre=15, mes de pago=Abril 2026 → desde 2026-03-16
 * hasta 2026-04-15.
 */
export function periodoFacturacion(
  anio: number,
  mes: number, // 1-indexado: 1=enero, 12=diciembre
  diaCierre: number,
): { desde: string; hasta: string } {
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const ultimoDiaMes = new Date(anio, mes, 0).getDate()
  const hasta = fmt(new Date(anio, mes - 1, Math.min(diaCierre, ultimoDiaMes)))
  const desde = fmt(new Date(anio, mes - 2, diaCierre + 1))

  return { desde, hasta }
}
