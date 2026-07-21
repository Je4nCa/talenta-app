import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CreditCard,
  HandCoins,
  Landmark,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/button'
import { useAbonosDeuda, useDeudas } from '../../hooks/useDeudas'
import { abonosDeudaRepository, deudasRepository } from '../../repositories'
import { formatearMonto } from '../../lib/formato'
import { FormularioAbonoDeuda } from '../FormularioAbonoDeuda'
import { FormularioDeuda } from '../FormularioDeuda'
import { TipoDeuda, type Deuda } from '../../types/deuda'

const ICONO_POR_TIPO: Record<TipoDeuda, typeof CreditCard> = {
  [TipoDeuda.TarjetaCredito]: CreditCard,
  [TipoDeuda.PrestamoPersonal]: HandCoins,
  [TipoDeuda.PrestamoBancario]: Landmark,
  [TipoDeuda.Otro]: Wallet,
}

const ETIQUETA_POR_TIPO: Record<TipoDeuda, string> = {
  [TipoDeuda.TarjetaCredito]: 'Tarjeta de crédito',
  [TipoDeuda.PrestamoPersonal]: 'Préstamo personal',
  [TipoDeuda.PrestamoBancario]: 'Préstamo bancario',
  [TipoDeuda.Otro]: 'Otro',
}

function TarjetaDeuda({ uid, deuda, moneda }: { uid: string; deuda: Deuda; moneda: string }) {
  const { abonos } = useAbonosDeuda(deuda.id)
  const [mostrandoForm, setMostrandoForm] = useState(false)
  const Icono = ICONO_POR_TIPO[deuda.tipo]

  const progreso =
    deuda.montoOriginal > 0
      ? Math.min(100, ((deuda.montoOriginal - deuda.saldoActual) / deuda.montoOriginal) * 100)
      : 0
  const pagada = deuda.saldoActual <= 0

  async function manejarEliminar() {
    await abonosDeudaRepository.eliminarPorDeuda(deuda.id)
    await deudasRepository.eliminar(deuda.id)
  }

  return (
    <div className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-talenta-gold/15 text-talenta-gold">
          <Icono className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-medium text-talenta-black">{deuda.nombre}</p>
          <p className="text-sm text-talenta-brown-mid">
            {ETIQUETA_POR_TIPO[deuda.tipo]}
            {deuda.tasaInteres !== undefined ? ` · ${deuda.tasaInteres}% anual` : ''}
          </p>
        </div>
        <button
          type="button"
          aria-label="Eliminar deuda"
          onClick={manejarEliminar}
          className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-talenta-tan/40">
          <div
            className={`h-full rounded-full transition-all ${pagada ? 'bg-green-600' : 'bg-talenta-gold'}`}
            style={{ width: `${progreso}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-talenta-brown-mid">
            {pagada ? '¡Pagada por completo!' : `Pagado: ${formatearMonto(deuda.montoOriginal - deuda.saldoActual, moneda)}`}
          </span>
          <span className="font-semibold text-talenta-black">
            Saldo: {formatearMonto(deuda.saldoActual, moneda)}
          </span>
        </div>
      </div>

      {deuda.cuotaMensual !== undefined && (
        <p className="mt-2 text-sm text-talenta-brown-mid">
          Cuota mensual esperada: {formatearMonto(deuda.cuotaMensual, moneda)}
        </p>
      )}

      {abonos.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {abonos
            .slice()
            .sort((a, b) => b.fecha.localeCompare(a.fecha))
            .map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-lg bg-talenta-cream/60 px-3 py-2 text-sm"
              >
                <span className="text-talenta-brown-dark">{a.fecha}</span>
                <span className="font-medium text-talenta-black">{formatearMonto(a.monto, moneda)}</span>
              </div>
            ))}
        </div>
      )}

      {!pagada && (
        <AnimatePresence mode="wait">
          {mostrandoForm ? (
            <FormularioAbonoDeuda
              key="form"
              uid={uid}
              deudaId={deuda.id}
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
      )}
    </div>
  )
}

export function CreditosDeudas() {
  const usuario = useAuth((state) => state.usuario)
  const { deudas } = useDeudas()
  const [mostrandoForm, setMostrandoForm] = useState(false)

  if (!usuario) return null

  const moneda = usuario.monedaCodigo
  const totalPendiente = deudas.reduce((acc, d) => acc + d.saldoActual, 0)
  const deudasOrdenadas = [...deudas].sort((a, b) => b.saldoActual - a.saldoActual)

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col gap-5 px-5 pt-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-2">
        <Landmark className="h-5 w-5 text-talenta-gold" />
        <h1 className="text-2xl font-semibold text-talenta-black">Créditos y Deudas</h1>
      </div>

      <div className="rounded-2xl bg-talenta-black p-5 text-talenta-white shadow-lg">
        <p className="text-sm text-talenta-tan">Total pendiente</p>
        <p className="mt-1 text-3xl font-semibold">{formatearMonto(totalPendiente, moneda)}</p>
        <p className="mt-1 text-sm text-talenta-tan">
          {deudas.length} {deudas.length === 1 ? 'deuda registrada' : 'deudas registradas'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {mostrandoForm ? (
          <FormularioDeuda
            key="form"
            uid={usuario.uid}
            onGuardado={() => setMostrandoForm(false)}
            onCancelar={() => setMostrandoForm(false)}
          />
        ) : (
          <motion.div key="boton">
            <Button size="lg" className="w-full gap-2" onClick={() => setMostrandoForm(true)}>
              <Plus className="h-5 w-5" />
              Agregar deuda
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {deudasOrdenadas.length === 0 ? (
        <p className="py-10 text-center text-base text-talenta-brown-mid">
          Sin deudas registradas. 🎉
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {deudasOrdenadas.map((d) => (
            <TarjetaDeuda key={d.id} uid={usuario.uid} deuda={d} moneda={moneda} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
