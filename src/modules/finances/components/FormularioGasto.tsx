import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { CATEGORIAS } from '../constants/categorias'
import { useTarjetas } from '../hooks/useTarjetas'
import { gastosRepository } from '../repositories'
import type { CategoriaId } from '../types/categoria'
import type { TipoPago } from '../types/gasto'

interface FormularioGastoProps {
  uid: string
  onGuardado: () => void
  onCancelar: () => void
}

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

export function FormularioGasto({ uid, onGuardado, onCancelar }: FormularioGastoProps) {
  const { tarjetas } = useTarjetas()
  const [titulo, setTitulo] = useState('')
  const [monto, setMonto] = useState('')
  const [categoriaId, setCategoriaId] = useState<CategoriaId>('otros')
  const [tipoPago, setTipoPago] = useState<TipoPago>('contado')
  const [tarjetaId, setTarjetaId] = useState('')
  const [fecha, setFecha] = useState(fechaHoy())
  const [guardando, setGuardando] = useState(false)

  const tarjetasDisponibles =
    tipoPago === 'tarjeta'
      ? tarjetas.filter((t) => t.tipo === 'credito')
      : tipoPago === 'debito'
        ? tarjetas.filter((t) => t.tipo === 'debito')
        : []

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(monto)
    if (!titulo.trim() || !valor || valor <= 0) return

    setGuardando(true)
    const ahora = new Date().toISOString()
    await gastosRepository.crear({
      id: crypto.randomUUID(),
      uid,
      titulo: titulo.trim(),
      monto: valor,
      categoriaId,
      tarjetaId: tarjetaId || undefined,
      tipoPago,
      fecha,
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
        <Label htmlFor="gasto-titulo">¿En qué gastaste?</Label>
        <Input
          id="gasto-titulo"
          placeholder="Ej. Supermercado"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gasto-monto">Monto</Label>
        <Input
          id="gasto-monto"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gasto-categoria">Categoría</Label>
        <Select
          id="gasto-categoria"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value as CategoriaId)}
        >
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.nombre}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gasto-fecha">Fecha</Label>
        <Input
          id="gasto-fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gasto-tipopago">¿Cómo pagaste?</Label>
        <Select
          id="gasto-tipopago"
          value={tipoPago}
          onChange={(e) => {
            setTipoPago(e.target.value as TipoPago)
            setTarjetaId('')
          }}
        >
          <option value="contado">Efectivo o Sinpe</option>
          <option value="tarjeta">Tarjeta de crédito</option>
          <option value="debito">Tarjeta de débito</option>
        </Select>
      </div>

      {tarjetasDisponibles.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="gasto-tarjeta">¿Con cuál tarjeta?</Label>
          <Select
            id="gasto-tarjeta"
            value={tarjetaId}
            onChange={(e) => setTarjetaId(e.target.value)}
          >
            <option value="">Selecciona una tarjeta</option>
            {tarjetasDisponibles.map((t) => (
              <option key={t.id} value={t.id}>
                {t.banco} {t.nombre}
              </option>
            ))}
          </Select>
        </div>
      )}

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
