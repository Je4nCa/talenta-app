import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { cn } from '@/shared/lib/utils'
import { BibliaApiError, obtenerCapitulo } from '../lib/bibliaClient'
import { alternarGuardado, alternarSubrayado, estaGuardado, useSubrayados } from '../hooks/useMarcadores'
import { LIBROS_BIBLIA, type LibroBiblia } from '../constants/libros'
import { SelectorLibroCapitulo } from './SelectorLibroCapitulo'
import type { Versiculo } from '../types'

export function LectorCapitulo() {
  const usuario = useAuth((state) => state.usuario)
  const bibliaId = usuario?.versionBiblia ?? 'RVR60'

  const [libro, setLibro] = useState<LibroBiblia>(LIBROS_BIBLIA[42]) // Juan, por defecto
  const [capitulo, setCapitulo] = useState(3)
  const [versiculos, setVersiculos] = useState<Versiculo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guardadosSet, setGuardadosSet] = useState<Set<number>>(new Set())

  const subrayados = useSubrayados(libro.referencia, capitulo)

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError(null)

    obtenerCapitulo(bibliaId, libro.referencia, capitulo)
      .then((datos) => {
        if (!cancelado) setVersiculos(datos)
      })
      .catch((err) => {
        if (!cancelado) {
          setError(err instanceof BibliaApiError ? err.message : 'No se pudo cargar el capítulo.')
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [bibliaId, libro, capitulo])

  useEffect(() => {
    if (!usuario) return
    let cancelado = false
    Promise.all(
      versiculos.map((v) => estaGuardado(usuario.uid, libro.referencia, capitulo, v.numero)),
    ).then((resultados) => {
      if (cancelado) return
      const nuevos = new Set<number>()
      resultados.forEach((guardado, i) => {
        if (guardado) nuevos.add(versiculos[i].numero)
      })
      setGuardadosSet(nuevos)
    })
    return () => {
      cancelado = true
    }
  }, [usuario, versiculos, libro, capitulo])

  function irCapituloAnterior() {
    if (capitulo > 1) {
      setCapitulo(capitulo - 1)
    } else {
      const indiceAnterior = LIBROS_BIBLIA.findIndex((l) => l.referencia === libro.referencia) - 1
      const libroAnterior = LIBROS_BIBLIA[indiceAnterior]
      if (libroAnterior) {
        setLibro(libroAnterior)
        setCapitulo(libroAnterior.capitulos)
      }
    }
  }

  function irCapituloSiguiente() {
    if (capitulo < libro.capitulos) {
      setCapitulo(capitulo + 1)
    } else {
      const indiceSiguiente = LIBROS_BIBLIA.findIndex((l) => l.referencia === libro.referencia) + 1
      const libroSiguiente = LIBROS_BIBLIA[indiceSiguiente]
      if (libroSiguiente) {
        setLibro(libroSiguiente)
        setCapitulo(1)
      }
    }
  }

  async function manejarSubrayar(numero: number) {
    if (!usuario) return
    await alternarSubrayado(usuario.uid, bibliaId, libro.referencia, capitulo, numero)
  }

  async function manejarGuardar(numero: number, texto: string) {
    if (!usuario) return
    await alternarGuardado(usuario.uid, bibliaId, libro.referencia, capitulo, numero, texto)
    setGuardadosSet((actual) => {
      const copia = new Set(actual)
      if (copia.has(numero)) {
        copia.delete(numero)
      } else {
        copia.add(numero)
      }
      return copia
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <SelectorLibroCapitulo
        libro={libro}
        capitulo={capitulo}
        onCambiarLibro={(nuevoLibro) => {
          setLibro(nuevoLibro)
          setCapitulo(1)
        }}
        onCambiarCapitulo={setCapitulo}
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={irCapituloAnterior}
          aria-label="Capítulo anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full text-talenta-brown-dark transition-colors hover:bg-talenta-tan/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold text-talenta-black">
          {libro.nombre} {capitulo}
        </span>
        <button
          type="button"
          onClick={irCapituloSiguiente}
          aria-label="Capítulo siguiente"
          className="flex h-10 w-10 items-center justify-center rounded-full text-talenta-brown-dark transition-colors hover:bg-talenta-tan/40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {cargando && (
        <p className="py-10 text-center text-base text-talenta-brown-mid">Cargando…</p>
      )}

      {error && <p className="py-10 text-center text-base text-red-700">{error}</p>}

      {!cargando && !error && (
        <motion.div
          className="flex flex-col gap-1 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {versiculos.map((v) => (
            <p
              key={v.numero}
              onClick={() => manejarSubrayar(v.numero)}
              className={cn(
                'group flex cursor-pointer gap-2 rounded-lg px-2 py-1.5 text-base leading-relaxed text-talenta-black transition-colors',
                subrayados.has(v.numero) && 'bg-talenta-gold/20',
              )}
            >
              <span className="select-none text-sm font-semibold text-talenta-gold">
                {v.numero}
              </span>
              <span className="flex-1">{v.texto}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  manejarGuardar(v.numero, v.texto)
                }}
                aria-label="Guardar versículo"
                className="shrink-0 self-start text-talenta-brown-mid transition-colors hover:text-talenta-gold"
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={guardadosSet.has(v.numero) ? 'currentColor' : 'none'}
                />
              </button>
            </p>
          ))}
        </motion.div>
      )}
    </div>
  )
}
