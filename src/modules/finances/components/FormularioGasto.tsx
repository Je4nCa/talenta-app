import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Camera, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { useCategorias } from '../hooks/useCategorias'
import { useTarjetas } from '../hooks/useTarjetas'
import { gastosRepository } from '../repositories'
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
  const { categorias } = useCategorias()
  const [titulo, setTitulo] = useState('')
  const [monto, setMonto] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [tipoPago, setTipoPago] = useState<TipoPago>('contado')
  const [tarjetaId, setTarjetaId] = useState('')
  const [fecha, setFecha] = useState(fechaHoy())
  const [esCompraFutura, setEsCompraFutura] = useState(false)
  const [fechaCobro, setFechaCobro] = useState('')
  const [facturaFile, setFacturaFile] = useState<File | null>(null)
  const [facturaPreviewUrl, setFacturaPreviewUrl] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!categoriaId && categorias.length > 0) {
      setCategoriaId(categorias.find((c) => c.nombre === 'Otros')?.id ?? categorias[0].id)
    }
  }, [categorias, categoriaId])

  useEffect(() => {
    if (!facturaFile) {
      setFacturaPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(facturaFile)
    setFacturaPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [facturaFile])

  function manejarSeleccionFactura(e: ChangeEvent<HTMLInputElement>) {
    setFacturaFile(e.target.files?.[0] ?? null)
  }

  const tarjetasDisponibles =
    tipoPago === 'tarjeta'
      ? tarjetas.filter((t) => t.tipo === 'credito')
      : tipoPago === 'debito'
        ? tarjetas.filter((t) => t.tipo === 'debito')
        : []

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(monto)
    if (!titulo.trim() || !valor || valor <= 0 || !categoriaId) return
    if (esCompraFutura && !fechaCobro) return

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
      fechaCobro: esCompraFutura ? fechaCobro : undefined,
      facturaImagen: facturaFile ?? undefined,
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
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.nombre}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gasto-fecha">Fecha de la compra</Label>
        <Input
          id="gasto-fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      <label htmlFor="gasto-futuro" className="flex cursor-pointer items-center gap-3">
        <Checkbox
          id="gasto-futuro"
          checked={esCompraFutura}
          onCheckedChange={(checked) => setEsCompraFutura(checked === true)}
        />
        <span className="text-base text-talenta-brown-dark">
          Es una compra que se cobra después
        </span>
      </label>

      {esCompraFutura && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="gasto-fecha-cobro">¿Cuándo se cobra?</Label>
          <Input
            id="gasto-fecha-cobro"
            type="date"
            value={fechaCobro}
            onChange={(e) => setFechaCobro(e.target.value)}
            required
          />
          <p className="text-sm text-talenta-brown-mid">
            Este gasto contará en el presupuesto del mes en que se cobra, no del mes en que lo
            compraste.
          </p>
        </div>
      )}

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

      <div className="flex flex-col gap-2">
        <Label htmlFor="gasto-factura">Factura o comprobante (opcional)</Label>
        {facturaPreviewUrl ? (
          <div className="relative w-28">
            <img
              src={facturaPreviewUrl}
              alt="Vista previa de la factura"
              className="h-28 w-28 rounded-xl object-cover shadow-sm"
            />
            <button
              type="button"
              aria-label="Quitar imagen"
              onClick={() => setFacturaFile(null)}
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-talenta-black text-talenta-white shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="gasto-factura"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-talenta-tan py-4 text-base text-talenta-brown-mid transition-colors hover:border-talenta-gold hover:text-talenta-gold"
          >
            <Camera className="h-5 w-5" />
            Tomar foto o subir imagen
          </label>
        )}
        <input
          id="gasto-factura"
          type="file"
          accept="image/*"
          onChange={manejarSeleccionFactura}
          className="hidden"
        />
        <p className="text-sm text-talenta-brown-mid">
          Se guarda como respaldo de tu compra, solo en este dispositivo.
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
