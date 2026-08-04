import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { fechaHoyLocal } from '@/shared/lib/fecha'
import { generarId } from '@/shared/lib/id'
import { useGuardado } from '../hooks/useGuardado'
import { abonosTarjetaRepository } from '../repositories'

interface FormularioAbonoProps {
  uid: string
  tarjetaId: string
  moneda?: string
  anio: number
  mes: number
  /** En crédito es un pago de lo gastado; en débito, dinero que entra. */
  etiquetaMonto?: string
  textoBoton?: string
  onGuardado: () => void
  onCancelar: () => void
}


export function FormularioAbono({
  uid,
  tarjetaId,
  moneda,
  anio,
  mes,
  etiquetaMonto = 'Monto pagado',
  textoBoton = 'Guardar',
  onGuardado,
  onCancelar,
}: FormularioAbonoProps) {
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(fechaHoyLocal())
  const { guardando, error, guardar } = useGuardado()

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(monto)
    if (!valor || valor <= 0) return

    await guardar(async () => {
      await abonosTarjetaRepository.crear({
        id: generarId(),
        tarjetaId,
        uid,
        anio,
        mes,
        monto: valor,
        moneda,
        fecha,
        creadoEn: new Date().toISOString(),
      })
    }, onGuardado)
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
        <Label htmlFor="abono-monto">{etiquetaMonto}</Label>
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
        <Label htmlFor="abono-fecha">Fecha</Label>
        <Input
          id="abono-fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      {error && (
        <p role="alert" className="text-base font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="default" className="flex-1" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" size="default" className="flex-1" disabled={guardando}>
          {guardando ? 'Guardando…' : textoBoton}
        </Button>
      </div>
    </motion.form>
  )
}
