import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { CATEGORIAS_DEUDA_ORDENADAS } from '../constants/deudas'
import { deudasRepository } from '../repositories'
import { TipoDeuda } from '../types/deuda'

interface FormularioDeudaProps {
  uid: string
  onGuardado: () => void
  onCancelar: () => void
}

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

export function FormularioDeuda({ uid, onGuardado, onCancelar }: FormularioDeudaProps) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoDeuda>(TipoDeuda.TarjetaCredito)
  const [montoOriginal, setMontoOriginal] = useState('')
  const [tasaInteres, setTasaInteres] = useState('')
  const [cuotaMensual, setCuotaMensual] = useState('')
  const [fechaInicio, setFechaInicio] = useState(fechaHoy())
  const [fechaLiquidacion, setFechaLiquidacion] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(montoOriginal)
    if (!nombre.trim() || !valor || valor <= 0) return

    setGuardando(true)
    const ahora = new Date().toISOString()
    await deudasRepository.crear({
      id: crypto.randomUUID(),
      uid,
      nombre: nombre.trim(),
      tipo,
      montoOriginal: valor,
      saldoActual: valor,
      tasaInteres: tasaInteres ? Number(tasaInteres) : undefined,
      cuotaMensual: cuotaMensual ? Number(cuotaMensual) : undefined,
      fechaInicio,
      fechaLiquidacion: fechaLiquidacion || undefined,
      creadoEn: ahora,
      actualizadoEn: ahora,
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
      className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="deuda-nombre">Acreedor (¿con quién o qué es la deuda?)</Label>
        <Input
          id="deuda-nombre"
          placeholder="Ej. Préstamo del carro, Tarjeta BAC"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="deuda-tipo">Tipo</Label>
        <Select id="deuda-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoDeuda)}>
          {CATEGORIAS_DEUDA_ORDENADAS.map((o) => (
            <option key={o.tipo} value={o.tipo}>
              {o.etiqueta}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="deuda-monto">Saldo de la deuda a la fecha</Label>
        <Input
          id="deuda-monto"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={montoOriginal}
          onChange={(e) => setMontoOriginal(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="deuda-fecha">Fecha de inicio</Label>
        <Input
          id="deuda-fecha"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="deuda-tasa">Tasa de interés anual % (opcional)</Label>
        <Input
          id="deuda-tasa"
          type="number"
          inputMode="decimal"
          placeholder="Ej. 12"
          value={tasaInteres}
          onChange={(e) => setTasaInteres(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="deuda-cuota">Pago mensual (opcional)</Label>
        <Input
          id="deuda-cuota"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={cuotaMensual}
          onChange={(e) => setCuotaMensual(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="deuda-liquidacion">Fecha estimada de liquidación (opcional)</Label>
        <Input
          id="deuda-liquidacion"
          type="date"
          value={fechaLiquidacion}
          onChange={(e) => setFechaLiquidacion(e.target.value)}
        />
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
