import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/button'
import { useColeccionUsuario } from '@/shared/hooks/useColeccionUsuario'
import { useGastosFijos } from '../../hooks/useGastos'
import { useTarjetas } from '../../hooks/useTarjetas'
import { tarjetasRepository } from '../../repositories'
import { formatearMonto } from '../../lib/formato'
import { FormularioAbono } from '../FormularioAbono'
import { FormularioTarjeta } from '../FormularioTarjeta'
import type { Gasto } from '../../types/gasto'
import type { AbonoTarjeta, TarjetaCredito } from '../../types/tarjeta'

function useTotalGastadoTarjeta(uid: string, tarjetaId: string) {
  const { datos: gastos } = useColeccionUsuario<Gasto>(uid, 'gastos')
  return gastos.filter((g) => g.tarjetaId === tarjetaId).reduce((acc, g) => acc + g.monto, 0)
}

/**
 * En una tarjeta de débito, un `AbonoTarjeta` es dinero que **entra**
 * (salario depositado, transferencia, recarga) — al revés que en crédito,
 * donde es un pago de lo gastado. Por eso aquí suma al disponible.
 */
function useTotalDepositado(uid: string, tarjetaId: string) {
  const { datos: abonos } = useColeccionUsuario<AbonoTarjeta>(uid, 'abonosTarjeta')
  return abonos.filter((a) => a.tarjetaId === tarjetaId).reduce((acc, a) => acc + a.monto, 0)
}

function FilaTarjeta({
  uid,
  tarjeta,
  moneda,
  totalFijos,
}: {
  uid: string
  tarjeta: TarjetaCredito
  moneda: string
  totalFijos: number
}) {
  const totalGastado = useTotalGastadoTarjeta(uid, tarjeta.id)
  const totalDepositado = useTotalDepositado(uid, tarjeta.id)
  const [mostrandoDeposito, setMostrandoDeposito] = useState(false)
  const monedaTarjeta = tarjeta.moneda ?? moneda

  const disponible =
    tarjeta.tipo === 'debito'
      ? (tarjeta.saldoInicial ?? 0) + totalDepositado - totalGastado
      : undefined

  const porcentajeUsado =
    tarjeta.tipo === 'credito' && tarjeta.limite
      ? Math.min(100, ((totalGastado + totalFijos) / tarjeta.limite) * 100)
      : undefined

  return (
    <div className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-talenta-white"
          style={{ backgroundColor: tarjeta.color }}
        >
          <CreditCard className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-base font-medium text-talenta-black">
            {tarjeta.banco} {tarjeta.nombre}
          </p>
          <p className="text-sm text-talenta-brown-mid">
            {tarjeta.tipo === 'credito' ? 'Crédito' : 'Débito'}
          </p>
        </div>
        <button
          type="button"
          aria-label="Eliminar tarjeta"
          onClick={() => tarjetasRepository.eliminar(tarjeta.uid, tarjeta.id)}
          className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {tarjeta.tipo === 'debito' ? (
        <>
          <p className="mt-4 text-2xl font-semibold text-talenta-black">
            {formatearMonto(disponible ?? 0, monedaTarjeta)}
            <span className="ml-2 text-sm font-normal text-talenta-brown-mid">disponible</span>
          </p>
          <p className="mt-1 text-sm text-talenta-brown-mid">
            Saldo inicial {formatearMonto(tarjeta.saldoInicial ?? 0, monedaTarjeta)}
            {totalDepositado > 0 && ` · Ingresado ${formatearMonto(totalDepositado, monedaTarjeta)}`}
            {totalGastado > 0 && ` · Gastado ${formatearMonto(totalGastado, monedaTarjeta)}`}
          </p>

          <AnimatePresence mode="wait">
            {mostrandoDeposito ? (
              <FormularioAbono
                key="deposito"
                uid={uid}
                tarjetaId={tarjeta.id}
                moneda={monedaTarjeta}
                anio={new Date().getFullYear()}
                mes={new Date().getMonth() + 1}
                etiquetaMonto="¿Cuánto dinero entró?"
                textoBoton="Agregar"
                onGuardado={() => setMostrandoDeposito(false)}
                onCancelar={() => setMostrandoDeposito(false)}
              />
            ) : (
              <Button
                size="default"
                variant="outline"
                className="mt-3 w-full gap-2"
                onClick={() => setMostrandoDeposito(true)}
              >
                <Plus className="h-4 w-4" />
                Agregar dinero
              </Button>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="mt-4">
          <p className="text-2xl font-semibold text-talenta-black">
            {formatearMonto(totalGastado + totalFijos, moneda)}
            {tarjeta.limite ? (
              <span className="ml-2 text-sm font-normal text-talenta-brown-mid">
                de {formatearMonto(tarjeta.limite, moneda)}
              </span>
            ) : null}
          </p>
          {porcentajeUsado !== undefined && (
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-talenta-tan/40">
              <div
                className="h-full rounded-full bg-talenta-gold transition-all"
                style={{ width: `${porcentajeUsado}%` }}
              />
            </div>
          )}
          <p className="mt-2 text-sm text-talenta-brown-mid">
            Corte día {tarjeta.diaCierre} · Pago día {tarjeta.diaPago}
          </p>
        </div>
      )}
    </div>
  )
}

export function Tarjetas() {
  const usuario = useAuth((state) => state.usuario)
  const { tarjetas } = useTarjetas()
  const { gastosFijos } = useGastosFijos()
  const [mostrandoForm, setMostrandoForm] = useState(false)

  if (!usuario) return null

  const moneda = usuario.monedaCodigo

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col gap-5 px-5 pt-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-talenta-gold" />
        <h1 className="text-2xl font-semibold text-talenta-black">Tarjetas</h1>
      </div>

      <AnimatePresence mode="wait">
        {mostrandoForm ? (
          <FormularioTarjeta
            key="form"
            uid={usuario.uid}
            onGuardado={() => setMostrandoForm(false)}
            onCancelar={() => setMostrandoForm(false)}
          />
        ) : (
          <motion.div key="boton">
            <Button size="lg" className="w-full gap-2" onClick={() => setMostrandoForm(true)}>
              <Plus className="h-5 w-5" />
              Agregar tarjeta
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {tarjetas.length === 0 ? (
        <p className="py-10 text-center text-base text-talenta-brown-mid">
          Aún no tienes tarjetas registradas.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tarjetas.map((t) => {
            const totalFijos = gastosFijos
              .filter((g) => g.activo && g.tarjetaId === t.id)
              .reduce((acc, g) => acc + g.monto, 0)
            return (
              <FilaTarjeta
                key={t.id}
                uid={usuario.uid}
                tarjeta={t}
                moneda={moneda}
                totalFijos={totalFijos}
              />
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
