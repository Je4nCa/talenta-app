import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Wallet } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { tarjetasRepository } from '../repositories'
import type { TarjetaCredito, TipoTarjeta } from '../types/tarjeta'

interface FormularioTarjetaProps {
  uid: string
  tarjetaExistente?: TarjetaCredito
  onGuardado: () => void
  onCancelar: () => void
}

const COLORES = ['#C4943A', '#5B4631', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f97316', '#6b7280']

export function FormularioTarjeta({
  uid,
  tarjetaExistente,
  onGuardado,
  onCancelar,
}: FormularioTarjetaProps) {
  const [tipo, setTipo] = useState<TipoTarjeta>(tarjetaExistente?.tipo ?? 'credito')
  const [banco, setBanco] = useState(tarjetaExistente?.banco ?? '')
  const [nombre, setNombre] = useState(tarjetaExistente?.nombre ?? '')
  const [color, setColor] = useState(tarjetaExistente?.color ?? COLORES[0])
  const [limite, setLimite] = useState(tarjetaExistente?.limite?.toString() ?? '')
  const [diaCierre, setDiaCierre] = useState(tarjetaExistente?.diaCierre?.toString() ?? '')
  const [diaPago, setDiaPago] = useState(tarjetaExistente?.diaPago?.toString() ?? '')
  const [saldoInicial, setSaldoInicial] = useState(tarjetaExistente?.saldoInicial?.toString() ?? '')
  const [guardando, setGuardando] = useState(false)

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    if (!banco.trim() || !nombre.trim()) return
    if (tipo === 'credito' && (!diaCierre || !diaPago)) return

    setGuardando(true)
    const ahora = new Date().toISOString()

    if (tarjetaExistente) {
      await tarjetasRepository.actualizar(tarjetaExistente.id, {
        banco: banco.trim(),
        nombre: nombre.trim(),
        tipo,
        color,
        limite: tipo === 'credito' ? Number(limite) || undefined : undefined,
        diaCierre: tipo === 'credito' ? Number(diaCierre) : undefined,
        diaPago: tipo === 'credito' ? Number(diaPago) : undefined,
        saldoInicial: tipo === 'debito' ? Number(saldoInicial) || 0 : undefined,
        actualizadoEn: ahora,
      })
    } else {
      await tarjetasRepository.crear({
        id: crypto.randomUUID(),
        uid,
        banco: banco.trim(),
        nombre: nombre.trim(),
        tipo,
        color,
        limite: tipo === 'credito' ? Number(limite) || undefined : undefined,
        diaCierre: tipo === 'credito' ? Number(diaCierre) : undefined,
        diaPago: tipo === 'credito' ? Number(diaPago) : undefined,
        saldoInicial: tipo === 'debito' ? Number(saldoInicial) || 0 : undefined,
        creadoEn: ahora,
        actualizadoEn: ahora,
      })
    }

    setGuardando(false)
    onGuardado()
  }

  return (
    <motion.form
      onSubmit={manejarGuardar}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <Label>Tipo de tarjeta</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTipo('credito')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-base font-medium transition-colors',
              tipo === 'credito'
                ? 'border-talenta-gold bg-talenta-gold/15 text-talenta-brown-dark'
                : 'border-talenta-tan text-talenta-brown-mid',
            )}
          >
            <CreditCard className="h-5 w-5" />
            Crédito
          </button>
          <button
            type="button"
            onClick={() => setTipo('debito')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-base font-medium transition-colors',
              tipo === 'debito'
                ? 'border-talenta-gold bg-talenta-gold/15 text-talenta-brown-dark'
                : 'border-talenta-tan text-talenta-brown-mid',
            )}
          >
            <Wallet className="h-5 w-5" />
            Débito
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tarjeta-banco">Banco</Label>
        <Input
          id="tarjeta-banco"
          placeholder="Ej. BAC, BCR"
          value={banco}
          onChange={(e) => setBanco(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tarjeta-nombre">Nombre de la tarjeta</Label>
        <Input
          id="tarjeta-nombre"
          placeholder="Ej. Visa Oro"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      {tipo === 'credito' ? (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tarjeta-limite">Límite de crédito (opcional)</Label>
            <Input
              id="tarjeta-limite"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tarjeta-cierre">Día de corte</Label>
              <Input
                id="tarjeta-cierre"
                type="number"
                min={1}
                max={31}
                placeholder="Ej. 15"
                value={diaCierre}
                onChange={(e) => setDiaCierre(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tarjeta-pago">Día de pago</Label>
              <Input
                id="tarjeta-pago"
                type="number"
                min={1}
                max={31}
                placeholder="Ej. 5"
                value={diaPago}
                onChange={(e) => setDiaPago(e.target.value)}
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor="tarjeta-saldo">Saldo inicial</Label>
          <Input
            id="tarjeta-saldo"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={saldoInicial}
            onChange={(e) => setSaldoInicial(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-3">
          {COLORES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              className={cn(
                'h-10 w-10 rounded-full border-2 transition-transform',
                color === c ? 'scale-110 border-talenta-black' : 'border-transparent',
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" size="lg" className="flex-1" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </motion.form>
  )
}
