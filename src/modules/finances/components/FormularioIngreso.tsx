import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { generarId } from '@/shared/lib/id'
import { useMonedas } from '../hooks/useMonedas'
import { useTarjetas } from '../hooks/useTarjetas'
import { useGuardado } from '../hooks/useGuardado'
import { ingresosRepository } from '../repositories'
import { SelectorMonedaMovimiento } from './SelectorMonedaMovimiento'

interface FormularioIngresoProps {
  uid: string
  /** Preselecciona la cuenta cuando se abre desde una tarjeta concreta. */
  tarjetaIdInicial?: string
  onGuardado: () => void
  onCancelar: () => void
}

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

export function FormularioIngreso({
  uid,
  tarjetaIdInicial,
  onGuardado,
  onCancelar,
}: FormularioIngresoProps) {
  const { tarjetas } = useTarjetas()
  const [tarjetaId, setTarjetaId] = useState(tarjetaIdInicial ?? '')
  const [titulo, setTitulo] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(fechaHoy())
  const { monedaPrincipal } = useMonedas()
  const [moneda, setMoneda] = useState(monedaPrincipal)
  const { guardando, error, guardar } = useGuardado()

  // Solo débito: en una tarjeta de crédito el dinero no "entra", se paga.
  const cuentasDisponibles = tarjetas.filter((t) => t.tipo === 'debito')

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    const valor = Number(monto)
    if (!titulo.trim() || !valor || valor <= 0) return

    await guardar(async () => {
      await ingresosRepository.crear({
        id: generarId(),
        uid,
        titulo: titulo.trim(),
        monto: valor,
        moneda,
        tarjetaId: tarjetaId || undefined,
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

      <SelectorMonedaMovimiento id="ingreso-moneda" valor={moneda} onCambiar={setMoneda} />

      {cuentasDisponibles.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="ingreso-tarjeta">¿A cuál cuenta entró?</Label>
          <Select
            id="ingreso-tarjeta"
            value={tarjetaId}
            onChange={(e) => setTarjetaId(e.target.value)}
          >
            <option value="">Efectivo o no aplica</option>
            {cuentasDisponibles.map((t) => (
              <option key={t.id} value={t.id}>
                {t.banco} {t.nombre}
              </option>
            ))}
          </Select>
          <p className="text-sm text-talenta-brown-mid">
            Si eliges una cuenta, el monto se suma a su disponible.
          </p>
        </div>
      )}

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

      {error && (
        <p role="alert" className="text-base font-medium text-red-700">
          {error}
        </p>
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
