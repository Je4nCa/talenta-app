import { Bookmark, Trash2 } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useVersiculosGuardados } from '../hooks/useMarcadores'
import { alternarGuardado } from '../hooks/useMarcadores'
import { LIBROS_BIBLIA } from '../constants/libros'
import { nombreLibroLocalizado, obtenerIdiomaDeBiblia } from '../lib/referencias'

export function VersiculosGuardadosList() {
  const usuario = useAuth((state) => state.usuario)
  const { guardados } = useVersiculosGuardados()

  if (guardados.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <Bookmark className="h-10 w-10 text-talenta-brown-mid/50" />
        <p className="text-base text-talenta-brown-mid">
          Aún no has guardado versículos. Tócalos en "Leer" para guardarlos aquí.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {guardados.map((g) => {
        const libro = LIBROS_BIBLIA.find((l) => l.referencia === g.libro)
        const nombreLibro = libro ? nombreLibroLocalizado(libro, obtenerIdiomaDeBiblia(g.bibliaId)) : g.libro
        return (
          <div
            key={g.id}
            className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-talenta-gold">
                {nombreLibro} {g.capitulo}:{g.versiculo}
              </p>
              <button
                type="button"
                aria-label="Quitar de guardados"
                onClick={() =>
                  usuario &&
                  alternarGuardado(usuario.uid, g.bibliaId, g.libro, g.capitulo, g.versiculo, g.texto)
                }
                className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-base text-talenta-black">{g.texto}</p>
          </div>
        )
      })}
    </div>
  )
}
