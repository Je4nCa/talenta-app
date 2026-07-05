import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Power, Receipt, Trash2 } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useCategorias } from '../../hooks/useCategorias'
import { useGastosFijos, useGastosPorPeriodo } from '../../hooks/useGastos'
import { useTarjetas } from '../../hooks/useTarjetas'
import { gastosFijosRepository, gastosRepository } from '../../repositories'
import { formatearMonto, NOMBRES_MES } from '../../lib/formato'
import { FormularioGasto } from '../FormularioGasto'
import { FormularioGastoFijo } from '../FormularioGastoFijo'
import { VisorFactura } from '../VisorFactura'
import { TabCategorias } from './TabCategorias'
import { TabResumen } from './TabResumen'

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

function TabVariables({ uid, moneda }: { uid: string; moneda: string }) {
  const { periodo, cambiarMes } = usePeriodoActivo()
  const { gastos } = useGastosPorPeriodo(periodo.anio, periodo.mes)
  const { tarjetas } = useTarjetas()
  const { mapa: mapaCategorias } = useCategorias()
  const [mostrandoForm, setMostrandoForm] = useState(false)

  const total = gastos.reduce((acc, g) => acc + g.monto, 0)
  const gastosOrdenados = [...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha))

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

      <div className="rounded-2xl bg-talenta-black p-5 text-talenta-white shadow-lg">
        <p className="text-sm text-talenta-tan">Total del mes</p>
        <p className="mt-1 text-3xl font-semibold">{formatearMonto(total, moneda)}</p>
      </div>

      <AnimatePresence mode="wait">
        {mostrandoForm ? (
          <FormularioGasto
            key="form"
            uid={uid}
            onGuardado={() => setMostrandoForm(false)}
            onCancelar={() => setMostrandoForm(false)}
          />
        ) : (
          <motion.div key="boton">
            <Button size="lg" className="w-full gap-2" onClick={() => setMostrandoForm(true)}>
              <Plus className="h-5 w-5" />
              Agregar gasto
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {gastosOrdenados.length === 0 ? (
        <p className="py-10 text-center text-base text-talenta-brown-mid">
          Sin gastos este mes. 💸
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {gastosOrdenados.map((g) => {
            const categoria = mapaCategorias[g.categoriaId]
            const tarjeta = tarjetas.find((t) => t.id === g.tarjetaId)
            return (
              <div
                key={g.id}
                className="flex items-center gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: `${categoria?.color}22` }}
                >
                  {categoria?.emoji ?? '📦'}
                </span>
                <div className="flex-1">
                  <p className="text-base font-medium text-talenta-black">{g.titulo}</p>
                  <p className="text-sm text-talenta-brown-mid">
                    {g.fecha}
                    {tarjeta ? ` · ${tarjeta.banco} ${tarjeta.nombre}` : ''}
                  </p>
                  {g.fechaCobro && (
                    <p className="mt-0.5 text-sm font-medium text-talenta-gold">
                      Se cobra el {g.fechaCobro}
                    </p>
                  )}
                </div>
                <p className="text-base font-semibold text-talenta-black">
                  {formatearMonto(g.monto, moneda)}
                </p>
                {g.facturaImagen && <VisorFactura imagen={g.facturaImagen} />}
                <button
                  type="button"
                  aria-label="Eliminar gasto"
                  onClick={() => gastosRepository.eliminar(g.id)}
                  className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TabFijos({ uid, moneda }: { uid: string; moneda: string }) {
  const { gastosFijos } = useGastosFijos()
  const { tarjetas } = useTarjetas()
  const { mapa: mapaCategorias } = useCategorias()
  const [mostrandoForm, setMostrandoForm] = useState(false)

  const totalActivos = gastosFijos.filter((g) => g.activo).reduce((acc, g) => acc + g.monto, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-talenta-black p-5 text-talenta-white shadow-lg">
        <p className="text-sm text-talenta-tan">Total fijo activo por mes</p>
        <p className="mt-1 text-3xl font-semibold">{formatearMonto(totalActivos, moneda)}</p>
      </div>

      <AnimatePresence mode="wait">
        {mostrandoForm ? (
          <FormularioGastoFijo
            key="form"
            uid={uid}
            onGuardado={() => setMostrandoForm(false)}
            onCancelar={() => setMostrandoForm(false)}
          />
        ) : (
          <motion.div key="boton">
            <Button size="lg" className="w-full gap-2" onClick={() => setMostrandoForm(true)}>
              <Plus className="h-5 w-5" />
              Agregar gasto fijo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {gastosFijos.length === 0 ? (
        <p className="py-10 text-center text-base text-talenta-brown-mid">
          Aún no tienes gastos fijos registrados.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {gastosFijos.map((g) => {
            const categoria = mapaCategorias[g.categoriaId]
            const tarjeta = tarjetas.find((t) => t.id === g.tarjetaId)
            return (
              <div
                key={g.id}
                className="flex items-center gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: `${categoria?.color}22` }}
                >
                  {categoria?.emoji ?? '📦'}
                </span>
                <div className="flex-1">
                  <p className="text-base font-medium text-talenta-black">{g.titulo}</p>
                  <p className="text-sm text-talenta-brown-mid">
                    {g.activo ? 'Activo' : 'Pausado'}
                    {tarjeta ? ` · ${tarjeta.banco} ${tarjeta.nombre}` : ''}
                  </p>
                </div>
                <p className="text-base font-semibold text-talenta-black">
                  {formatearMonto(g.monto, moneda)}
                </p>
                <button
                  type="button"
                  aria-label={g.activo ? 'Pausar gasto fijo' : 'Reactivar gasto fijo'}
                  onClick={() => gastosFijosRepository.actualizar(g.id, { activo: !g.activo })}
                  className="shrink-0 text-talenta-brown-mid transition-colors hover:text-talenta-gold"
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Eliminar gasto fijo"
                  onClick={() => gastosFijosRepository.eliminar(g.id)}
                  className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Gastos() {
  const usuario = useAuth((state) => state.usuario)
  if (!usuario) return null

  const moneda = usuario.monedaCodigo

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col gap-5 px-5 pt-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-2">
        <Receipt className="h-5 w-5 text-talenta-gold" />
        <h1 className="text-2xl font-semibold text-talenta-black">Gastos</h1>
      </div>

      <Tabs defaultValue="variables">
        <TabsList className="grid h-auto grid-cols-2 gap-1 sm:flex sm:h-14">
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="fijos">Fijos</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
        </TabsList>
        <TabsContent value="variables">
          <TabVariables uid={usuario.uid} moneda={moneda} />
        </TabsContent>
        <TabsContent value="fijos">
          <TabFijos uid={usuario.uid} moneda={moneda} />
        </TabsContent>
        <TabsContent value="categorias">
          <TabCategorias uid={usuario.uid} moneda={moneda} />
        </TabsContent>
        <TabsContent value="resumen">
          <TabResumen moneda={moneda} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
