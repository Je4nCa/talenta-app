import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Receipt, RefreshCw, Repeat, Wallet } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { buscarPais } from '@/shared/lib/paises'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useGastosFijos, useGastosPorPeriodo } from '../../hooks/useGastos'
import { useCuotasPorPeriodo } from '../../hooks/useCuotas'
import { useSalariosPorPeriodo } from '../../hooks/useSalarios'
import { salariosRepository } from '../../repositories'
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

function FormularioQuincena({
  uid,
  anio,
  mes,
  quincena,
}: {
  uid: string
  anio: number
  mes: number
  quincena: 1 | 2
}) {
  const [monto, setMonto] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function guardar() {
    const valor = Number(monto)
    if (!valor || valor <= 0) return
    setGuardando(true)
    await salariosRepository.crear({
      id: crypto.randomUUID(),
      uid,
      monto: valor,
      anio,
      mes,
      quincena,
      creadoEn: new Date().toISOString(),
    })
    setGuardando(false)
    setMonto('')
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        inputMode="decimal"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="h-11"
      />
      <Button size="default" className="h-11 px-4" disabled={guardando} onClick={guardar}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function Dashboard() {
  const usuario = useAuth((state) => state.usuario)
  const { periodo, cambiarMes } = usePeriodoActivo()
  const { gastos } = useGastosPorPeriodo(periodo.anio, periodo.mes)
  const { gastosFijos } = useGastosFijos()
  const { cuotas } = useCuotasPorPeriodo(periodo.anio, periodo.mes)
  const { salarios } = useSalariosPorPeriodo(periodo.anio, periodo.mes)

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

  const quincena1 = salarios.find((s) => s.quincena === 1)
  const quincena2 = salarios.find((s) => s.quincena === 2)
  const totalSalario = (quincena1?.monto ?? 0) + (quincena2?.monto ?? 0)
  const balance = totalSalario - totalGastado

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
          Ingresos {formatearMonto(totalSalario, moneda)} · Gastos {formatearMonto(totalGastado, moneda)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <TarjetaEstadistica titulo="Variables" monto={totalVariables} moneda={moneda} icon={Receipt} />
        <TarjetaEstadistica titulo="Fijos" monto={totalFijos} moneda={moneda} icon={Repeat} />
        <TarjetaEstadistica titulo="Cuotas" monto={totalCuotas} moneda={moneda} icon={RefreshCw} />
      </div>

      <div className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-talenta-black">
          <Wallet className="h-4 w-4 text-talenta-gold" />
          <span className="text-base font-medium">Mi salario</span>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <p className="mb-1 text-sm text-talenta-brown-mid">Primera quincena</p>
            {quincena1 ? (
              <p className="text-base font-semibold text-talenta-black">
                {formatearMonto(quincena1.monto, moneda)}
              </p>
            ) : (
              <FormularioQuincena
                uid={usuario.uid}
                anio={periodo.anio}
                mes={periodo.mes}
                quincena={1}
              />
            )}
          </div>

          <div>
            <p className="mb-1 text-sm text-talenta-brown-mid">Segunda quincena</p>
            {quincena2 ? (
              <p className="text-base font-semibold text-talenta-black">
                {formatearMonto(quincena2.monto, moneda)}
              </p>
            ) : (
              <FormularioQuincena
                uid={usuario.uid}
                anio={periodo.anio}
                mes={periodo.mes}
                quincena={2}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
