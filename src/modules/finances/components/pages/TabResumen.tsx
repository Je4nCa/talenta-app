import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCategorias } from '../../hooks/useCategorias'
import { useGastosPorPeriodo } from '../../hooks/useGastos'
import { useSalariosPorPeriodo } from '../../hooks/useSalarios'
import { formatearMonto, NOMBRES_MES } from '../../lib/formato'

function usePeriodoActivo() {
  const hoy = new Date()
  const [periodo, setPeriodo] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() + 1 })

  function cambiarMes(delta: number) {
    setPeriodo((actual) => {
      const fecha = new Date(actual.anio, actual.mes - 1 + delta, 1)
      return { anio: fecha.getFullYear(), mes: fecha.getMonth() + 1 }
    })
  }

  return { periodo, cambiarMes }
}

function diaDeFecha(fechaISO: string): number {
  return Number(fechaISO.slice(8, 10))
}

function formatearDia(anio: number, mes: number, dia: number): string {
  const fecha = new Date(anio, mes - 1, dia)
  return fecha.toLocaleDateString('es', { weekday: 'short', day: 'numeric' })
}

export function TabResumen({ moneda }: { moneda: string }) {
  const { periodo, cambiarMes } = usePeriodoActivo()
  const { gastos } = useGastosPorPeriodo(periodo.anio, periodo.mes)
  const { salarios } = useSalariosPorPeriodo(periodo.anio, periodo.mes)
  const { mapa: mapaCategorias } = useCategorias()

  // El salario se registra por quincena, sin día exacto, así que para el
  // balance diario asumimos que cada quincena "entra" el día 1 y el 16 del
  // mes — es una convención simple, no una fecha real de depósito.
  const ingresosPorDia = useMemo(() => {
    const mapa: Record<number, number> = {}
    for (const s of salarios) {
      const dia = s.quincena === 1 ? 1 : 16
      mapa[dia] = (mapa[dia] ?? 0) + s.monto
    }
    return mapa
  }, [salarios])

  const diasConMovimiento = useMemo(() => {
    const egresosPorDia: Record<number, number> = {}
    for (const g of gastos) {
      const dia = diaDeFecha(g.fechaCobro ?? g.fecha)
      egresosPorDia[dia] = (egresosPorDia[dia] ?? 0) + g.monto
    }

    const dias = new Set([...Object.keys(ingresosPorDia), ...Object.keys(egresosPorDia)].map(Number))

    return [...dias]
      .sort((a, b) => a - b)
      .map((dia) => {
        const ingresos = ingresosPorDia[dia] ?? 0
        const egresos = egresosPorDia[dia] ?? 0
        return { dia, ingresos, egresos, balance: ingresos - egresos }
      })
  }, [gastos, ingresosPorDia])

  const semanas = useMemo(() => {
    const grupos: Record<number, { total: number; porCategoria: Record<string, number> }> = {}
    for (const g of gastos) {
      const dia = diaDeFecha(g.fechaCobro ?? g.fecha)
      const numeroSemana = Math.min(4, Math.ceil(dia / 7))
      if (!grupos[numeroSemana]) grupos[numeroSemana] = { total: 0, porCategoria: {} }
      grupos[numeroSemana].total += g.monto
      grupos[numeroSemana].porCategoria[g.categoriaId] =
        (grupos[numeroSemana].porCategoria[g.categoriaId] ?? 0) + g.monto
    }
    return Object.entries(grupos)
      .map(([numero, datos]) => ({ numero: Number(numero), ...datos }))
      .sort((a, b) => a.numero - b.numero)
  }, [gastos])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => cambiarMes(-1)}
          aria-label="Mes anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full text-talenta-brown-dark transition-colors hover:bg-talenta-tan/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold text-talenta-black">
          {NOMBRES_MES[periodo.mes - 1]} {periodo.anio}
        </span>
        <button
          type="button"
          onClick={() => cambiarMes(1)}
          aria-label="Mes siguiente"
          className="flex h-10 w-10 items-center justify-center rounded-full text-talenta-brown-dark transition-colors hover:bg-talenta-tan/40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-talenta-black">Balance diario</h2>
        {diasConMovimiento.length === 0 ? (
          <p className="py-6 text-center text-base text-talenta-brown-mid">
            Sin movimientos este mes todavía.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {diasConMovimiento.map(({ dia, ingresos, egresos, balance }) => (
              <div
                key={dia}
                className="flex items-center justify-between gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-3 shadow-sm"
              >
                <span className="w-16 shrink-0 text-sm capitalize text-talenta-brown-mid">
                  {formatearDia(periodo.anio, periodo.mes, dia)}
                </span>
                <div className="min-w-0 flex-1 text-right text-xs text-talenta-brown-mid">
                  {ingresos > 0 && <p>+{formatearMonto(ingresos, moneda)}</p>}
                  {egresos > 0 && <p>-{formatearMonto(egresos, moneda)}</p>}
                </div>
                <span
                  className={`w-24 shrink-0 break-words text-right text-sm font-semibold ${
                    balance < 0 ? 'text-red-600' : 'text-talenta-black'
                  }`}
                >
                  {formatearMonto(balance, moneda)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-talenta-black">Resumen semanal</h2>
        {semanas.length === 0 ? (
          <p className="py-6 text-center text-base text-talenta-brown-mid">
            Sin gastos este mes todavía.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {semanas.map((semana) => (
              <div
                key={semana.numero}
                className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-talenta-black">
                    Semana {semana.numero}
                  </span>
                  <span className="text-base font-semibold text-talenta-black">
                    {formatearMonto(semana.total, moneda)}
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  {Object.entries(semana.porCategoria)
                    .sort((a, b) => b[1] - a[1])
                    .map(([categoriaId, monto]) => {
                      const categoria = mapaCategorias[categoriaId]
                      return (
                        <div
                          key={categoriaId}
                          className="flex items-center justify-between text-sm text-talenta-brown-mid"
                        >
                          <span>
                            {categoria?.emoji ?? '📦'} {categoria?.nombre ?? 'Otros'}
                          </span>
                          <span>{formatearMonto(monto, moneda)}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
