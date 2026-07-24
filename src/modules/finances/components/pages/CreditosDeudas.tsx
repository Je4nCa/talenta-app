import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CreditCard,
  Download,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Home,
  Landmark,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { CATEGORIAS_BIEN_ORDENADAS } from '../../constants/bienes'
import { CATEGORIAS_DEUDA_ORDENADAS } from '../../constants/deudas'
import { useBienes } from '../../hooks/useBienes'
import { useAbonosDeuda, useDeudas } from '../../hooks/useDeudas'
import { formatearMonto } from '../../lib/formato'
import { descargarPdfBienes, descargarPdfDeudas } from '../../lib/pdf'
import { abonosDeudaRepository, bienesRepository, deudasRepository } from '../../repositories'
import { TipoDeuda, type Deuda } from '../../types/deuda'
import { FormularioAbonoDeuda } from '../FormularioAbonoDeuda'
import { FormularioDeuda } from '../FormularioDeuda'

const ICONO_POR_TIPO: Record<TipoDeuda, typeof CreditCard> = {
  [TipoDeuda.TarjetaCredito]: CreditCard,
  [TipoDeuda.PrestamoPrendario]: HandCoins,
  [TipoDeuda.HipotecaVivienda]: Home,
  [TipoDeuda.DeudaFamiliarAmigos]: Users,
  [TipoDeuda.CuentaMedica]: HeartPulse,
  [TipoDeuda.FinanciamientoEducacion]: GraduationCap,
  [TipoDeuda.FiadorPersonaEmpresa]: Landmark,
}

const ETIQUETA_POR_TIPO: Record<TipoDeuda, string> = Object.fromEntries(
  CATEGORIAS_DEUDA_ORDENADAS.map((c) => [c.tipo, c.etiqueta]),
) as Record<TipoDeuda, string>

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

      {(deuda.cuotaMensual !== undefined || deuda.fechaLiquidacion) && (
        <p className="mt-2 text-sm text-talenta-brown-mid">
          {deuda.cuotaMensual !== undefined && `Pago mensual: ${formatearMonto(deuda.cuotaMensual, moneda)}`}
          {deuda.cuotaMensual !== undefined && deuda.fechaLiquidacion && ' · '}
          {deuda.fechaLiquidacion && `Liquidación estimada: ${deuda.fechaLiquidacion}`}
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

function TabDeudas({
  uid,
  nombreUsuario,
  emailUsuario,
  moneda,
}: {
  uid: string
  nombreUsuario: string
  emailUsuario: string
  moneda: string
}) {
  const { deudas } = useDeudas()
  const [mostrandoForm, setMostrandoForm] = useState(false)

  const totalPendiente = deudas.reduce((acc, d) => acc + d.saldoActual, 0)
  const deudasOrdenadas = [...deudas].sort((a, b) => b.saldoActual - a.saldoActual)

  function manejarDescargar() {
    descargarPdfDeudas({ nombreUsuario, emailUsuario, moneda, deudas })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-talenta-black p-5 text-talenta-white shadow-lg">
        <p className="text-sm text-talenta-tan">Total pendiente</p>
        <p className="mt-1 text-3xl font-semibold">{formatearMonto(totalPendiente, moneda)}</p>
        <p className="mt-1 text-sm text-talenta-tan">
          {deudas.length} {deudas.length === 1 ? 'deuda registrada' : 'deudas registradas'}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="default"
          className="flex-1 gap-2"
          disabled={deudas.length === 0}
          onClick={manejarDescargar}
        >
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mostrandoForm ? (
          <FormularioDeuda
            key="form"
            uid={uid}
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
            <TarjetaDeuda key={d.id} uid={uid} deuda={d} moneda={moneda} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilaBien({
  etiqueta,
  valor,
  onGuardar,
}: {
  etiqueta: string
  valor: number
  onGuardar: (valor: number) => void
}) {
  const [texto, setTexto] = useState(valor > 0 ? String(valor) : '')

  return (
    <div className="flex items-center gap-3 rounded-xl border border-talenta-tan/60 bg-talenta-white/90 px-4 py-3">
      <label className="flex-1 text-base text-talenta-black">{etiqueta}</label>
      <Input
        type="number"
        inputMode="decimal"
        placeholder="0.00"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => onGuardar(Number(texto) || 0)}
        className="h-11 w-32 text-right"
      />
    </div>
  )
}

function TabBienes({
  uid,
  nombreUsuario,
  emailUsuario,
  moneda,
}: {
  uid: string
  nombreUsuario: string
  emailUsuario: string
  moneda: string
}) {
  const { bienes } = useBienes()

  const valorPorCategoria: Record<string, number> = Object.fromEntries(
    bienes.map((b) => [b.categoria, b.valorActual]),
  )
  const totalBienes = bienes.reduce((acc, b) => acc + b.valorActual, 0)

  function manejarDescargar() {
    descargarPdfBienes({ nombreUsuario, emailUsuario, moneda, valorPorCategoria })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-talenta-black p-5 text-talenta-white shadow-lg">
        <p className="text-sm text-talenta-tan">Total de Bienes</p>
        <p className="mt-1 text-3xl font-semibold">{formatearMonto(totalBienes, moneda)}</p>
        <p className="mt-1 text-sm text-talenta-tan">Se guarda automáticamente al salir de cada campo.</p>
      </div>

      <Button variant="outline" size="default" className="gap-2" onClick={manejarDescargar}>
        <Download className="h-4 w-4" />
        Descargar PDF
      </Button>

      <div className="flex flex-col gap-2">
        {CATEGORIAS_BIEN_ORDENADAS.map(({ categoria, etiqueta }) => (
          <FilaBien
            key={categoria}
            etiqueta={etiqueta}
            valor={valorPorCategoria[categoria] ?? 0}
            onGuardar={(valor) => bienesRepository.guardarValor(uid, categoria, valor)}
          />
        ))}
      </div>
    </div>
  )
}

export function CreditosDeudas() {
  const usuario = useAuth((state) => state.usuario)

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
        <Landmark className="h-5 w-5 text-talenta-gold" />
        <h1 className="text-2xl font-semibold text-talenta-black">Créditos y Deudas</h1>
      </div>

      <Tabs defaultValue="deudas">
        <TabsList>
          <TabsTrigger value="deudas">Deudas</TabsTrigger>
          <TabsTrigger value="bienes">Bienes</TabsTrigger>
        </TabsList>
        <TabsContent value="deudas">
          <TabDeudas
            uid={usuario.uid}
            nombreUsuario={usuario.nombre}
            emailUsuario={usuario.email}
            moneda={moneda}
          />
        </TabsContent>
        <TabsContent value="bienes">
          <TabBienes
            uid={usuario.uid}
            nombreUsuario={usuario.nombre}
            emailUsuario={usuario.email}
            moneda={moneda}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
