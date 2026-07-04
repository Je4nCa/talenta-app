import Dexie, { type Table } from 'dexie'
import type {
  AbonoTarjeta,
  Categoria,
  CuotaMensual,
  Gasto,
  GastoFijo,
  MontoManualTarjeta,
  PlanCuotas,
  Salario,
  TarjetaCredito,
} from '../types'

export class FinanzasDB extends Dexie {
  tarjetas!: Table<TarjetaCredito>
  gastos!: Table<Gasto>
  gastosFijos!: Table<GastoFijo>
  planesCuotas!: Table<PlanCuotas>
  cuotasMensuales!: Table<CuotaMensual>
  abonosTarjeta!: Table<AbonoTarjeta>
  montosManuales!: Table<MontoManualTarjeta>
  salarios!: Table<Salario>
  categorias!: Table<Categoria>

  constructor() {
    super('talenta-finanzas-db')

    this.version(1).stores({
      tarjetas: 'id, uid, banco, tipo, creadoEn',
      gastos: 'id, uid, fecha, categoriaId, tarjetaId, tipoPago, creadoEn',
      gastosFijos: 'id, uid, categoriaId, tarjetaId, recurrencia, activo, creadoEn',
      planesCuotas: 'id, uid, tarjetaId, fechaInicio, fechaFin, creadoEn',
      cuotasMensuales: 'id, planCuotasId, [anio+mes], estado',
      abonosTarjeta: 'id, tarjetaId, uid, [anio+mes]',
      montosManuales: 'id, tarjetaId, [anio+mes]',
      salarios: 'id, uid, [anio+mes]',
    })

    this.version(2).stores({
      tarjetas: 'id, uid, banco, tipo, creadoEn',
      gastos: 'id, uid, fecha, fechaCobro, categoriaId, tarjetaId, tipoPago, creadoEn',
      gastosFijos: 'id, uid, categoriaId, tarjetaId, recurrencia, activo, creadoEn',
      planesCuotas: 'id, uid, tarjetaId, fechaInicio, fechaFin, creadoEn',
      cuotasMensuales: 'id, planCuotasId, [anio+mes], estado',
      abonosTarjeta: 'id, tarjetaId, uid, [anio+mes]',
      montosManuales: 'id, tarjetaId, [anio+mes]',
      salarios: 'id, uid, [anio+mes]',
      categorias: 'id, uid, esPersonalizada',
    })
  }
}

export const finanzasDB = new FinanzasDB()
