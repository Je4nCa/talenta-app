import type { ID, FechaHoraISO, FechaISO } from './comunes'

/**
 * Un ingreso es una entrada libre con fecha real, igual que un Gasto —
 * no asume una frecuencia fija (quincenal, mensual, semanal). El usuario
 * agrega tantos como reciba: un salario mensual es 1 entrada al mes, uno
 * quincenal son 2, uno semanal son ~4, y cualquier ingreso extra
 * (freelance, regalo, venta) es una entrada más sin estructura especial.
 */
export interface Ingreso {
  id: ID
  uid: string
  titulo: string
  monto: number
  fecha: FechaISO
  /**
   * Cuenta/tarjeta de débito a la que entró el dinero, opcional (si el
   * ingreso fue en efectivo no aplica). Cuando está, el monto suma al
   * disponible de esa tarjeta — el espejo de un gasto pagado con ella.
   * Sin esto un ingreso "quedaba en el aire": contaba en el balance del mes
   * pero no se reflejaba en el saldo de la cuenta donde realmente cayó.
   */
  tarjetaId?: ID
  notas?: string
  /**
   * Moneda en la que ocurrió realmente este movimiento. `undefined` = la
   * moneda principal del usuario (así siguen siendo válidos los registros
   * creados antes de que existiera la segunda moneda).
   */
  moneda?: string
  creadoEn: FechaHoraISO
}
