import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { CATEGORIAS } from '../constants/categorias'
import { useTarjetas } from '../hooks/useTarjetas'
import { gastosFijosRepository } from '../repositories'
import { TipoRecurrencia } from '../types/gasto'
import type { CategoriaId } from '../types/categoria'

interface FormularioGastoFijoProps {
  uid: string
  onGuardado: () => void
  onCancelar: () => void
}

const OPCIONES_RECURRENCIA: { valor: TipoRecurrencia; etiqueta: string }[] = [
  { valor: TipoRecurrencia.Mensual, etiqueta: 'Cada mes' },
  { valor: TipoRecurrencia.Bimestral, etiqueta: 'Cada 2 meses' },
  { valor: TipoRecurrencia.Trimestral, etiqueta: 'Cada 3 meses' },
  { valor: TipoRecurrencia.Semestral, etiqueta: 'Cada 6 meses' },
  { valor: TipoRecurrencia.Anual, etiqueta: 'Cada año' },
]

export function FormularioGastoFijo({ uid, onGuardado, onCancelar }: FormularioGastoFijoProps) {
  const { tarjetas } = useTarjetas()
  const [titulo, setTitulo] = useState('')
  const [monto, setMonto] = useState('')
  const [categoriaId, setCategoriaId] = useState<CategoriaId>('otros')
  const [recurrencia, setRecurrencia] = useState<TipoRecurrencia>(TipoRecurrencia.Mensual)
  const [tarjetaId, setTarjetaId] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(monto)
    if (!titulo.trim() || !valor || valor <= 0) return

    setGuardando(true)
    const ahora = new Date().toISOString()
    await gastosFijosRepository.crear({
      id: crypto.randomUUID(),
      uid,
      titulo: titulo.trim(),
      monto: valor,
      categoriaId,
      recurrencia,
      tarjetaId: tarjetaId || undefined,
      activo: true,
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
        <Label htmlFor="fijo-titulo">Nombre del gasto</Label>
        <Input
          id="fijo-titulo"
          placeholder="Ej. Alquiler, Netflix"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="fijo-monto">Monto</Label>
        <Input
          id="fijo-monto"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="fijo-categoria">Categoría</Label>
        <Select
          id="fijo-categoria"
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
        <Label htmlFor="fijo-recurrencia">¿Cada cuánto se repite?</Label>
        <Select
          id="fijo-recurrencia"
          value={recurrencia}
          onChange={(e) => setRecurrencia(e.target.value as TipoRecurrencia)}
        >
          {OPCIONES_RECURRENCIA.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </Select>
      </div>

      {tarjetas.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="fijo-tarjeta">¿Se paga con alguna tarjeta? (opcional)</Label>
          <Select
            id="fijo-tarjeta"
            value={tarjetaId}
            onChange={(e) => setTarjetaId(e.target.value)}
          >
            <option value="">Ninguna</option>
            {tarjetas.map((t) => (
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
