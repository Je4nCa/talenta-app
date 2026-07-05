import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useCategorias } from '../../hooks/useCategorias'
import { useGastosFijos, useGastosPorPeriodo } from '../../hooks/useGastos'
import { useIngresosPorPeriodo } from '../../hooks/useIngresos'
import { categoriasRepository } from '../../repositories'
import { formatearMonto, NOMBRES_MES } from '../../lib/formato'
import { FormularioCategoria } from '../FormularioCategoria'
import type { Categoria } from '../../types/categoria'

function usePeriodoActivo() {
  const hoy = new Date()
  const [periodo, setPeriodo] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() + 1 })

  function cambiarMes(delta: number) {
    setPeriodo((actual) => {
      const fecha = new Date(actual.anio, actual.mes - 1 + delta, 1)
      return { anio: fecha.getFullYear(), mes: fecha.getMonth() + 1 }
    })
  }

  return { periodo, cambiarMes }
}

function FilaCategoria({
  categoria,
  gastado,
  ingresoTotal,
  moneda,
  onEditar,
}: {
  categoria: Categoria
  gastado: number
  ingresoTotal: number
  moneda: string
  onEditar: () => void
}) {
  const recomendado =
    categoria.porcentajeRecomendado && ingresoTotal > 0
      ? (categoria.porcentajeRecomendado / 100) * ingresoTotal
      : undefined
  const porcentajeUsado = recomendado ? Math.min(100, (gastado / recomendado) * 100) : undefined
  const seExcede = recomendado !== undefined && gastado > recomendado

  return (
    <div className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${categoria.color}22` }}
        >
          {categoria.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-medium text-talenta-black">{categoria.nombre}</p>
          {categoria.porcentajeRecomendado !== undefined && (
            <p className="text-sm text-talenta-brown-mid">
              Recomendado: {categoria.porcentajeRecomendado}%
            </p>
          )}
        </div>
        <p className="shrink-0 break-words text-right text-base font-semibold text-talenta-black">
          {formatearMonto(gastado, moneda)}
        </p>
        <button
          type="button"
          aria-label="Editar categoría"
          onClick={onEditar}
          className="shrink-0 text-talenta-brown-mid transition-colors hover:text-talenta-gold"
        >
          <Pencil className="h-4 w-4" />
        </button>
        {categoria.esPersonalizada && (
          <button
            type="button"
            aria-label="Eliminar categoría"
            onClick={() => categoriasRepository.eliminar(categoria.id)}
            className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {porcentajeUsado !== undefined && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-talenta-tan/40">
            <div
              className={`h-full rounded-full transition-all ${seExcede ? 'bg-red-500' : 'bg-talenta-gold'}`}
              style={{ width: `${porcentajeUsado}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-talenta-brown-mid">
            {seExcede ? 'Te pasaste de lo recomendado: ' : 'Meta: '}
            {formatearMonto(recomendado ?? 0, moneda)}
          </p>
        </div>
      )}
    </div>
  )
}

export function TabCategorias({ uid, moneda }: { uid: string; moneda: string }) {
  const { periodo, cambiarMes } = usePeriodoActivo()
  const { gastos } = useGastosPorPeriodo(periodo.anio, periodo.mes)
  const { gastosFijos } = useGastosFijos()
  const { ingresos } = useIngresosPorPeriodo(periodo.anio, periodo.mes)
  const { categorias } = useCategorias()
  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState<Categoria | undefined>(undefined)

  const ingresoTotal = ingresos.reduce((acc, i) => acc + i.monto, 0)

  const gastadoPorCategoria = useMemo(() => {
    const mapa: Record<string, number> = {}
    for (const g of gastos) {
      mapa[g.categoriaId] = (mapa[g.categoriaId] ?? 0) + g.monto
    }
    for (const g of gastosFijos) {
      if (g.activo) mapa[g.categoriaId] = (mapa[g.categoriaId] ?? 0) + g.monto
    }
    return mapa
  }, [gastos, gastosFijos])

  const categoriasOrdenadas = [...categorias].sort(
    (a, b) => (gastadoPorCategoria[b.id] ?? 0) - (gastadoPorCategoria[a.id] ?? 0),
  )

  function abrirNuevo() {
    setCategoriaEnEdicion(undefined)
    setMostrandoForm(true)
  }

  function abrirEdicion(categoria: Categoria) {
    setCategoriaEnEdicion(categoria)
    setMostrandoForm(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => cambiarMes(-1)}
          aria-label="Mes anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full text-talenta-brown-dark transition-colors hover:bg-talenta-tan/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold text-talenta-black">
          {NOMBRES_MES[periodo.mes - 1]} {periodo.anio}
        </span>
        <button
          type="button"
          onClick={() => cambiarMes(1)}
          aria-label="Mes siguiente"
          className="flex h-10 w-10 items-center justify-center rounded-full text-talenta-brown-dark transition-colors hover:bg-talenta-tan/40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mostrandoForm ? (
          <FormularioCategoria
            key="form"
            uid={uid}
            categoriaExistente={categoriaEnEdicion}
            onGuardado={() => setMostrandoForm(false)}
            onCancelar={() => setMostrandoForm(false)}
          />
        ) : (
          <motion.div key="boton">
            <Button size="lg" className="w-full gap-2" onClick={abrirNuevo}>
              <Plus className="h-5 w-5" />
              Agregar categoría
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        {categoriasOrdenadas.map((c) => (
          <FilaCategoria
            key={c.id}
            categoria={c}
            gastado={gastadoPorCategoria[c.id] ?? 0}
            ingresoTotal={ingresoTotal}
            moneda={moneda}
            onEditar={() => abrirEdicion(c)}
          />
        ))}
      </div>
    </div>
  )
}
