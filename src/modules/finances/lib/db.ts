import Dexie, { type Table } from 'dexie'
import type {
  AbonoDeuda,
  AbonoTarjeta,
  Categoria,
  Deuda,
  Gasto,
  GastoFijo,
  Ingreso,
  MontoManualTarjeta,
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
  abonosTarjeta!: Table<AbonoTarjeta>
  montosManuales!: Table<MontoManualTarjeta>
  categorias!: Table<Categoria>
  ingresos!: Table<Ingreso>
  deudas!: Table<Deuda>
  abonosDeuda!: Table<AbonoDeuda>

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

    // "Tasa cero" (planesCuotas/cuotasMensuales) nunca tuvo UI para crear
    // datos reales — se retira sin migración y se reemplaza por Créditos y
    // Deudas (deudas/abonosDeuda), un módulo de seguimiento de deudas y
    // préstamos de verdad.
    this.version(4).stores({
      tarjetas: 'id, uid, banco, tipo, creadoEn',
      gastos: 'id, uid, fecha, fechaCobro, categoriaId, tarjetaId, tipoPago, creadoEn',
      gastosFijos: 'id, uid, categoriaId, tarjetaId, recurrencia, activo, creadoEn',
      planesCuotas: null,
      cuotasMensuales: null,
      abonosTarjeta: 'id, tarjetaId, uid, [anio+mes]',
      montosManuales: 'id, tarjetaId, [anio+mes]',
      categorias: 'id, uid, esPersonalizada',
      ingresos: 'id, uid, fecha, creadoEn',
      deudas: 'id, uid, tipo, creadoEn',
      abonosDeuda: 'id, deudaId, uid, fecha',
    })
  }
}

export const finanzasDB = new FinanzasDB()
