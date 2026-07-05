import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Trash2, Wallet } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/button'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'
import { useTarjetas } from '../../hooks/useTarjetas'
import { useGastosFijos } from '../../hooks/useGastos'
import { finanzasDB } from '../../lib/db'
import { abonosTarjetaRepository } from '../../repositories'
import { periodoFacturacion } from '../../lib/billingCycle'
import { formatearMonto, NOMBRES_MES } from '../../lib/formato'
import { FormularioAbono } from '../FormularioAbono'
import type { TarjetaCredito } from '../../types/tarjeta'

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

function TarjetaPago({
  uid,
  tarjeta,
  anio,
  mes,
  moneda,
  totalFijos,
}: {
  uid: string
  tarjeta: TarjetaCredito
  anio: number
  mes: number
  moneda: string
  totalFijos: number
}) {
  const [mostrandoForm, setMostrandoForm] = useState(false)
  const { desde, hasta } = periodoFacturacion(anio, mes, tarjeta.diaCierre ?? 1)

  const totalGastos = useLiveQuery(async () => {
    const gastos = await finanzasDB.gastos.where('tarjetaId').equals(tarjeta.id).toArray()
    return gastos.filter((g) => g.fecha >= desde && g.fecha <= hasta).reduce((acc, g) => acc + g.monto, 0)
  }, [tarjeta.id, desde, hasta])

  const abonos = useLiveQuery(
    () => abonosTarjetaRepository.porTarjetaYPeriodo(tarjeta.id, anio, mes),
    [tarjeta.id, anio, mes],
  )

  const totalPeriodo = (totalGastos ?? 0) + totalFijos
  const totalAbonado = (abonos ?? []).reduce((acc, a) => acc + a.monto, 0)
  const pendiente = totalPeriodo - totalAbonado

  return (
    <div className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium text-talenta-black">
          {tarjeta.banco} {tarjeta.nombre}
        </p>
        <span className="text-sm text-talenta-brown-mid">
          {desde} → {hasta}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-talenta-brown-mid">Total del período</p>
          <p className="text-lg font-semibold text-talenta-black">
            {formatearMonto(totalPeriodo, moneda)}
          </p>
        </div>
        <div>
          <p className="text-sm text-talenta-brown-mid">Pagado</p>
          <p className="text-lg font-semibold text-talenta-black">
            {formatearMonto(totalAbonado, moneda)}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-talenta-gold/15 p-3">
        <p className="text-sm text-talenta-brown-dark">Pendiente por pagar</p>
        <p className="text-2xl font-semibold text-talenta-black">
          {formatearMonto(Math.max(0, pendiente), moneda)}
        </p>
      </div>

      {(abonos ?? []).length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {abonos!.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-lg bg-talenta-cream/60 px-3 py-2 text-sm"
            >
              <span className="text-talenta-brown-dark">{a.fecha}</span>
              <span className="font-medium text-talenta-black">
                {formatearMonto(a.monto, moneda)}
              </span>
              <button
                type="button"
                aria-label="Eliminar pago"
                onClick={() => abonosTarjetaRepository.eliminar(a.id)}
                className="text-talenta-brown-mid transition-colors hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {mostrandoForm ? (
          <FormularioAbono
            key="form"
            uid={uid}
            tarjetaId={tarjeta.id}
            anio={anio}
            mes={mes}
            onGuardado={() => setMostrandoForm(false)}
            onCancelar={() => setMostrandoForm(false)}
          />
        ) : (
          <Button
            size="default"
            variant="outline"
            className="mt-3 w-full gap-2"
            onClick={() => setMostrandoForm(true)}
          >
            <Plus className="h-4 w-4" />
            Registrar pago
          </Button>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Pagos() {
  const usuario = useAuth((state) => state.usuario)
  const { tarjetas } = useTarjetas()
  const { gastosFijos } = useGastosFijos()
  const { periodo, cambiarMes } = usePeriodoActivo()

  if (!usuario) return null

  const moneda = usuario.monedaCodigo
  const tarjetasCredito = tarjetas.filter((t) => t.tipo === 'credito')

  if (tarjetasCredito.length === 0) {
    return (
      <ModulePlaceholder
        icon={Wallet}
        titulo="Pagos"
        descripcion="Agrega una tarjeta de crédito en la pestaña Tarjetas para ver aquí el desglose de tus pagos."
      />
    )
  }

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col gap-5 px-5 pt-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-talenta-gold" />
        <h1 className="text-2xl font-semibold text-talenta-black">Pagos</h1>
      </div>

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

      <div className="flex flex-col gap-4">
        {tarjetasCredito.map((t) => {
          const totalFijos = gastosFijos
            .filter((g) => g.activo && g.tarjetaId === t.id)
            .reduce((acc, g) => acc + g.monto, 0)
          return (
            <TarjetaPago
              key={t.id}
              uid={usuario.uid}
              tarjeta={t}
              anio={periodo.anio}
              mes={periodo.mes}
              moneda={moneda}
              totalFijos={totalFijos}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
