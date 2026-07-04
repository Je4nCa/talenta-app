import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { abonosTarjetaRepository } from '../repositories'

interface FormularioAbonoProps {
  uid: string
  tarjetaId: string
  anio: number
  mes: number
  onGuardado: () => void
  onCancelar: () => void
}

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

export function FormularioAbono({
  uid,
  tarjetaId,
  anio,
  mes,
  onGuardado,
  onCancelar,
}: FormularioAbonoProps) {
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(fechaHoy())
  const [guardando, setGuardando] = useState(false)

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(monto)
    if (!valor || valor <= 0) return

    setGuardando(true)
    await abonosTarjetaRepository.crear({
      id: crypto.randomUUID(),
      tarjetaId,
      uid,
      anio,
      mes,
      monto: valor,
      fecha,
      creadoEn: new Date().toISOString(),
    })
    setGuardando(false)
    onGuardado()
  }

  return (
    <motion.form
      onSubmit={manejarGuardar}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 flex flex-col gap-4 overflow-hidden rounded-xl border border-talenta-tan/60 bg-talenta-cream/60 p-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="abono-monto">Monto pagado</Label>
        <Input
          id="abono-monto"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="abono-fecha">Fecha del pago</Label>
        <Input
          id="abono-fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" size="default" className="flex-1" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" size="default" className="flex-1" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Registrar pago'}
        </Button>
      </div>
    </motion.form>
  )
}
