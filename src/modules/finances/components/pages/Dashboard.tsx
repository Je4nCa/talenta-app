import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Receipt, RefreshCw, Repeat, Trash2, Wallet } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { buscarPais } from '@/shared/lib/paises'
import { Button } from '@/shared/components/ui/button'
import { useGastosFijos, useGastosPorPeriodo } from '../../hooks/useGastos'
import { useCuotasPorPeriodo } from '../../hooks/useCuotas'
import { useIngresosPorPeriodo } from '../../hooks/useIngresos'
import { ingresosRepository } from '../../repositories'
import { formatearMonto, NOMBRES_MES } from '../../lib/formato'
import { FormularioIngreso } from '../FormularioIngreso'

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

function TarjetaEstadistica({
  titulo,
  monto,
  moneda,
  icon: Icon,
}: {
  titulo: string
  monto: number
  moneda: string
  icon: typeof Receipt
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-3 shadow-sm">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-talenta-gold/15 text-talenta-gold">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="text-xs text-talenta-brown-mid">{titulo}</span>
      <span className="break-words text-base font-semibold leading-tight text-talenta-black">
        {formatearMonto(monto, moneda)}
      </span>
    </div>
  )
}

export function Dashboard() {
  const usuario = useAuth((state) => state.usuario)
  const { periodo, cambiarMes } = usePeriodoActivo()
  const { gastos } = useGastosPorPeriodo(periodo.anio, periodo.mes)
  const { gastosFijos } = useGastosFijos()
  const { cuotas } = useCuotasPorPeriodo(periodo.anio, periodo.mes)
  const { ingresos } = useIngresosPorPeriodo(periodo.anio, periodo.mes)
  const [mostrandoForm, setMostrandoForm] = useState(false)

  if (!usuario) return null

  const pais = buscarPais(usuario.paisCodigo)
  const moneda = pais?.monedaCodigo ?? 'USD'

  const totalVariables = useMemo(() => gastos.reduce((acc, g) => acc + g.monto, 0), [gastos])
  const totalFijos = useMemo(
    () => gastosFijos.filter((g) => g.activo).reduce((acc, g) => acc + g.monto, 0),
    [gastosFijos],
  )
  const totalCuotas = useMemo(() => cuotas.reduce((acc, c) => acc + c.monto, 0), [cuotas])
  const totalGastado = totalVariables + totalFijos + totalCuotas

  const totalIngresos = useMemo(() => ingresos.reduce((acc, i) => acc + i.monto, 0), [ingresos])
  const balance = totalIngresos - totalGastado
  const ingresosOrdenados = [...ingresos].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
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

      <div className="rounded-2xl bg-talenta-black p-5 text-talenta-white shadow-lg">
        <p className="text-sm text-talenta-tan">Balance del mes</p>
        <p className="mt-1 text-3xl font-semibold">{formatearMonto(balance, moneda)}</p>
        <p className="mt-1 text-sm text-talenta-tan">
          Ingresos {formatearMonto(totalIngresos, moneda)} · Gastos {formatearMonto(totalGastado, moneda)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <TarjetaEstadistica titulo="Variables" monto={totalVariables} moneda={moneda} icon={Receipt} />
        <TarjetaEstadistica titulo="Fijos" monto={totalFijos} moneda={moneda} icon={Repeat} />
        <TarjetaEstadistica titulo="Cuotas" monto={totalCuotas} moneda={moneda} icon={RefreshCw} />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2 text-talenta-black">
          <Wallet className="h-4 w-4 text-talenta-gold" />
          <span className="text-base font-medium">Mis ingresos</span>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {mostrandoForm ? (
              <FormularioIngreso
                key="form"
                uid={usuario.uid}
                onGuardado={() => setMostrandoForm(false)}
                onCancelar={() => setMostrandoForm(false)}
              />
            ) : (
              <motion.div key="boton">
                <Button size="lg" className="w-full gap-2" onClick={() => setMostrandoForm(true)}>
                  <Plus className="h-5 w-5" />
                  Agregar ingreso
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {ingresosOrdenados.length === 0 ? (
            <p className="py-6 text-center text-base text-talenta-brown-mid">
              Sin ingresos registrados este mes.
            </p>
          ) : (
            ingresosOrdenados.map((i) => (
              <div
                key={i.id}
                className="flex items-center gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-talenta-black">{i.titulo}</p>
                  <p className="text-sm text-talenta-brown-mid">{i.fecha}</p>
                </div>
                <p className="shrink-0 text-base font-semibold text-talenta-black">
                  {formatearMonto(i.monto, moneda)}
                </p>
                <button
                  type="button"
                  aria-label="Eliminar ingreso"
                  onClick={() => ingresosRepository.eliminar(i.id)}
                  className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
