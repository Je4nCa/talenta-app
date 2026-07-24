export type PlanId = 'mensual' | 'trimestral' | 'anual'

export interface Plan {
  id: PlanId
  nombre: string
  precioUSD: number
  meses: number
  precioMensualEquivalenteUSD: number
  descuentoPorcentaje: number
}
