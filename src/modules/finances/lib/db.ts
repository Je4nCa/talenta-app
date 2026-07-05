import Dexie, { type Table } from 'dexie'
import type {
  AbonoTarjeta,
  Categoria,
  CuotaMensual,
  Gasto,
  GastoFijo,
  Ingreso,
  MontoManualTarjeta,
  PlanCuotas,
  TarjetaCredito,
} from '../types'

interface SalarioLegacy {
  id: string
  uid: string
  monto: number
  anio: number
  mes: number
  quincena: 1 | 2
  notas?: string
  creadoEn: string
}

function esSalarioLegacy(valor: unknown): valor is SalarioLegacy {
  return typeof valor === 'object' && valor !== null && 'quincena' in valor
}

export class FinanzasDB extends Dexie {
  tarjetas!: Table<TarjetaCredito>
  gastos!: Table<Gasto>
  gastosFijos!: Table<GastoFijo>
  planesCuotas!: Table<PlanCuotas>
  cuotasMensuales!: Table<CuotaMensual>
  abonosTarjeta!: Table<AbonoTarjeta>
  montosManuales!: Table<MontoManualTarjeta>
  categorias!: Table<Categoria>
  ingresos!: Table<Ingreso>

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

    // Los ingresos dejan de asumir una frecuencia fija (quincena) y pasan a
    // ser entradas libres con fecha real, igual que un Gasto — así cubren
    // salario mensual, quincenal, semanal o cualquier ingreso extra.
    this.version(3)
      .stores({
        tarjetas: 'id, uid, banco, tipo, creadoEn',
        gastos: 'id, uid, fecha, fechaCobro, categoriaId, tarjetaId, tipoPago, creadoEn',
        gastosFijos: 'id, uid, categoriaId, tarjetaId, recurrencia, activo, creadoEn',
        planesCuotas: 'id, uid, tarjetaId, fechaInicio, fechaFin, creadoEn',
        cuotasMensuales: 'id, planCuotasId, [anio+mes], estado',
        abonosTarjeta: 'id, tarjetaId, uid, [anio+mes]',
        montosManuales: 'id, tarjetaId, [anio+mes]',
        categorias: 'id, uid, esPersonalizada',
        salarios: null,
        ingresos: 'id, uid, fecha, creadoEn',
      })
      .upgrade(async (tx) => {
        const salariosViejos = await tx.table('salarios').toArray()
        const ingresos = salariosViejos.filter(esSalarioLegacy).map((s) => ({
          id: s.id,
          uid: s.uid,
          titulo: `Quincena ${s.quincena}`,
          monto: s.monto,
          fecha: `${s.anio}-${String(s.mes).padStart(2, '0')}-${s.quincena === 1 ? '01' : '16'}`,
          notas: s.notas,
          creadoEn: s.creadoEn,
        }))
        await tx.table('ingresos').bulkPut(ingresos)
      })
  }
}

export const finanzasDB = new FinanzasDB()
