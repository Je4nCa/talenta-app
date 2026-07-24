import { useEffect, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { ejecutarPagoTilopay, iniciarCheckoutTilopay, TilopayError } from '../lib/tilopayClient'
import type { Plan } from '../types/plan'

interface CheckoutTilopayProps {
  plan: Plan
  ordenId: string
  nombreUsuario: string
  emailUsuario: string
  onCancelar: () => void
}

interface OpcionSdk {
  id: string
  name: string
}

/**
 * Los `id` de los campos (`method`, `cards`, `ccnumber`, `expdate`, `cvv`,
 * `result`) siguen exactamente el contrato documentado del SDK de TiloPay
 * (payFormTilopay) — el SDK los lee directamente del DOM al llamar
 * `startPayment()`, así que no se pueden renombrar.
 */
export function CheckoutTilopay({
  plan,
  ordenId,
  nombreUsuario,
  emailUsuario,
  onCancelar,
}: CheckoutTilopayProps) {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metodos, setMetodos] = useState<OpcionSdk[]>([])
  const [tarjetasGuardadas, setTarjetasGuardadas] = useState<OpcionSdk[]>([])
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    let cancelado = false

    async function iniciar() {
      try {
        const urlRedirect = `${window.location.origin}${import.meta.env.BASE_URL}#/perfil/suscripcion?orden=${ordenId}`
        const respuesta = await iniciarCheckoutTilopay({
          plan,
          ordenId,
          nombreUsuario,
          emailUsuario,
          urlRedirect,
        })
        if (cancelado) return
        setMetodos(respuesta.methods)
        setTarjetasGuardadas(respuesta.cards.map((tarjeta) => ({ id: tarjeta.id, name: tarjeta.name })))
      } catch (err) {
        if (cancelado) return
        setError(err instanceof TilopayError ? err.message : 'No se pudo iniciar el pago.')
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    iniciar()
    return () => {
      cancelado = true
    }
  }, [plan, ordenId, nombreUsuario, emailUsuario])

  async function manejarPago(e: FormEvent) {
    e.preventDefault()
    setProcesando(true)
    setError(null)
    try {
      await ejecutarPagoTilopay()
    } catch (err) {
      setError(err instanceof TilopayError ? err.message : 'No se pudo procesar el pago.')
    } finally {
      setProcesando(false)
    }
  }

  if (cargando) {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-8 text-center shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-talenta-gold" />
        <p className="text-sm text-talenta-brown-mid">Conectando con TiloPay…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex w-full flex-col gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
        <p className="text-sm font-medium text-red-700">{error}</p>
        <Button variant="outline" size="lg" onClick={onCancelar}>
          Volver
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={manejarPago}
      className="payFormTilopay flex w-full flex-col gap-4 rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm"
    >
      <p className="text-base font-semibold text-talenta-black">
        Pagar plan {plan.nombre} — ${plan.precioUSD.toFixed(2)}
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="method">Método de pago</Label>
        <Select id="method" required>
          {metodos.map((metodo) => (
            <option key={metodo.id} value={metodo.id}>
              {metodo.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cards">Tarjeta guardada</Label>
        <Select id="cards" defaultValue="">
          <option value="">Usar una tarjeta nueva</option>
          {tarjetasGuardadas.map((tarjeta) => (
            <option key={tarjeta.id} value={tarjeta.id}>
              {tarjeta.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ccnumber">Número de tarjeta</Label>
        <Input
          id="ccnumber"
          name="ccnumber"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          required
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="expdate">Vencimiento</Label>
          <Input id="expdate" name="expdate" placeholder="MM/YY" required />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" name="cvv" inputMode="numeric" placeholder="123" required />
        </div>
      </div>

      <div id="result" />

      <div className="mt-1 flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" size="lg" className="flex-1" disabled={procesando}>
          {procesando ? 'Procesando…' : 'Pagar'}
        </Button>
      </div>
    </form>
  )
}
