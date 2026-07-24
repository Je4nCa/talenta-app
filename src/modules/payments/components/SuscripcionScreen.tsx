import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { obtenerPlan } from '../constants/planes'
import { useSuscripcion } from '../hooks/useSuscripcion'
import { tilopayEstaConfigurado } from '../lib/tilopayClient'
import { suscripcionesRepository } from '../repositories/suscripciones.repository'
import type { PlanId } from '../types/plan'
import { CheckoutTilopay } from './CheckoutTilopay'
import { PlanesSuscripcion } from './PlanesSuscripcion'

function diasRestantes(finPeriodoGratuito: string): number {
  const hoy = new Date()
  const fin = new Date(`${finPeriodoGratuito}T00:00:00`)
  return Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
}

export function SuscripcionScreen() {
  const navigate = useNavigate()
  const usuario = useAuth((state) => state.usuario)
  const { suscripcion } = useSuscripcion(usuario?.uid ?? '')
  const [planId, setPlanId] = useState<PlanId>('mensual')
  const [ordenPendiente, setOrdenPendiente] = useState<string | null>(null)

  if (!usuario) return null

  const dias = diasRestantes(usuario.finPeriodoGratuito)
  const plan = obtenerPlan(planId)
  const configurado = tilopayEstaConfigurado()
  const uid = usuario.uid

  async function manejarContinuar() {
    const ordenId = crypto.randomUUID()
    await suscripcionesRepository.crear({
      id: ordenId,
      uid,
      planId,
      montoUSD: plan.precioUSD,
      estado: 'pendiente',
      ordenId,
      creadoEn: new Date().toISOString(),
    })
    setOrdenPendiente(ordenId)
  }

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/perfil')}
          aria-label="Volver a Perfil"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-talenta-white/80 text-talenta-brown-dark shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-talenta-black">Mi suscripción</h1>
      </div>

      {suscripcion?.estado === 'activa' ? (
        <div className="flex w-full items-center gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-talenta-gold" />
          <div>
            <p className="text-base font-semibold text-talenta-black">Suscripción activa</p>
            <p className="text-sm text-talenta-brown-mid">
              Plan {obtenerPlan(suscripcion.planId).nombre}
              {suscripcion.fechaVencimiento && ` · Vence el ${suscripcion.fechaVencimiento}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
          <p className="text-base font-semibold text-talenta-black">
            {dias > 0 ? 'Prueba gratuita activa' : 'Tu prueba gratuita ya terminó'}
          </p>
          <p className="mt-1 text-sm text-talenta-brown-mid">
            {dias > 0
              ? `Te quedan ${dias} ${dias === 1 ? 'día' : 'días'} de acceso gratis (hasta el ${usuario.finPeriodoGratuito}).`
              : `Venció el ${usuario.finPeriodoGratuito}. Elige un plan para seguir usando TALENTA.`}
          </p>
        </div>
      )}

      {!ordenPendiente ? (
        <>
          <PlanesSuscripcion planSeleccionado={planId} onSeleccionar={setPlanId} />

          <Button size="lg" className="w-full" onClick={manejarContinuar}>
            Continuar al pago
          </Button>

          <p className="text-center text-xs text-talenta-brown-mid">
            Pagos procesados por TiloPay. Comisión de la pasarela: 4.25% + $0.35 por tarjeta, 2% +
            $0.35 por SINPE Móvil.
          </p>
        </>
      ) : configurado ? (
        <CheckoutTilopay
          plan={plan}
          ordenId={ordenPendiente}
          nombreUsuario={usuario.nombre}
          emailUsuario={usuario.email}
          onCancelar={() => setOrdenPendiente(null)}
        />
      ) : (
        <div className="flex w-full flex-col gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
          <p className="text-base font-semibold text-talenta-black">
            Los pagos en línea todavía no están disponibles
          </p>
          <p className="text-sm text-talenta-brown-mid">
            Elegiste el plan {plan.nombre} (${plan.precioUSD.toFixed(2)}). Estamos terminando de
            conectar la pasarela de pago. Mientras tanto, escribe a Carlos o Alicia para coordinar
            tu pago.
          </p>
          <Button variant="outline" size="lg" onClick={() => setOrdenPendiente(null)}>
            Volver
          </Button>
        </div>
      )}
    </motion.div>
  )
}
