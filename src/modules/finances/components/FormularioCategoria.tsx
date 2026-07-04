import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { categoriasRepository } from '../repositories'
import { TipoCategoria, type Categoria } from '../types/categoria'

interface FormularioCategoriaProps {
  uid: string
  categoriaExistente?: Categoria
  onGuardado: () => void
  onCancelar: () => void
}

const COLORES = ['#C4943A', '#5B4631', '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#6b7280']
const EMOJIS = ['📦', '🍔', '🏠', '🚗', '💊', '🎬', '📱', '✈️', '📚', '🐾', '☕', '🛍️', '💡', '🎁', '⚽']

export function FormularioCategoria({
  uid,
  categoriaExistente,
  onGuardado,
  onCancelar,
}: FormularioCategoriaProps) {
  const [nombre, setNombre] = useState(categoriaExistente?.nombre ?? '')
  const [emoji, setEmoji] = useState(categoriaExistente?.emoji ?? EMOJIS[0])
  const [color, setColor] = useState(categoriaExistente?.color ?? COLORES[0])
  const [porcentajeRecomendado, setPorcentajeRecomendado] = useState(
    categoriaExistente?.porcentajeRecomendado?.toString() ?? '',
  )
  const [guardando, setGuardando] = useState(false)

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) return

    setGuardando(true)
    const porcentaje = porcentajeRecomendado ? Number(porcentajeRecomendado) : undefined

    if (categoriaExistente) {
      await categoriasRepository.actualizar(categoriaExistente.id, {
        nombre: nombre.trim(),
        emoji,
        color,
        porcentajeRecomendado: porcentaje,
      })
    } else {
      await categoriasRepository.crear({
        id: crypto.randomUUID(),
        uid,
        nombre: nombre.trim(),
        emoji,
        color,
        tipo: TipoCategoria.Egreso,
        porcentajeRecomendado: porcentaje,
        esPersonalizada: true,
        creadoEn: new Date().toISOString(),
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
        <Label htmlFor="categoria-nombre">Nombre</Label>
        <Input
          id="categoria-nombre"
          placeholder="Ej. Gastos hormiga"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Ícono</Label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-xl border-2 text-xl transition-colors',
                emoji === e ? 'border-talenta-gold bg-talenta-gold/15' : 'border-talenta-tan',
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

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

      <div className="flex flex-col gap-2">
        <Label htmlFor="categoria-porcentaje">% recomendado de tu ingreso (opcional)</Label>
        <Input
          id="categoria-porcentaje"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          placeholder="Ej. 15"
          value={porcentajeRecomendado}
          onChange={(e) => setPorcentajeRecomendado(e.target.value)}
        />
        <p className="text-sm text-talenta-brown-mid">
          Te ayudamos a comparar cuánto gastas en esta categoría contra lo recomendado.
        </p>
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
