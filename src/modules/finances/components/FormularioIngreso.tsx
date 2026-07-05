import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { ingresosRepository } from '../repositories'

interface FormularioIngresoProps {
  uid: string
  onGuardado: () => void
  onCancelar: () => void
}

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

export function FormularioIngreso({ uid, onGuardado, onCancelar }: FormularioIngresoProps) {
  const [titulo, setTitulo] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(fechaHoy())
  const [guardando, setGuardando] = useState(false)

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(monto)
    if (!titulo.trim() || !valor || valor <= 0) return

    setGuardando(true)
    await ingresosRepository.crear({
      id: crypto.randomUUID(),
      uid,
      titulo: titulo.trim(),
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
      className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="ingreso-titulo">¿De dónde viene este ingreso?</Label>
        <Input
          id="ingreso-titulo"
          placeholder="Ej. Salario, Freelance, Bono"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ingreso-monto">Monto</Label>
        <Input
          id="ingreso-monto"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ingreso-fecha">Fecha en que lo recibiste</Label>
        <Input
          id="ingreso-fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
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
