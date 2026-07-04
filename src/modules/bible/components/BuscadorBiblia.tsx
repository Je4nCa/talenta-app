import { useEffect, useState, type FormEvent } from 'react'
import { Bookmark, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { BibliaApiError, buscarPalabra } from '../lib/bibliaClient'
import {
  nombreLibroLocalizado,
  obtenerIdiomaDeBiblia,
  parsearReferencia,
  type ReferenciaParseada,
} from '../lib/referencias'
import { alternarGuardado, estaGuardado } from '../hooks/useMarcadores'
import type { ResultadoBusqueda } from '../types'

interface BuscadorBibliaProps {
  onIrAVersiculo: (
    libro: ReferenciaParseada['libro'],
    capitulo: number,
    versiculo: number,
  ) => void
}

interface ResultadoValido {
  resultado: ResultadoBusqueda
  parseada: ReferenciaParseada
}

function ResultadoBusquedaItem({
  resultado,
  parseada,
  bibliaId,
  idioma,
  onIrAVersiculo,
}: ResultadoValido & {
  bibliaId: string
  idioma: string
  onIrAVersiculo: BuscadorBibliaProps['onIrAVersiculo']
}) {
  const usuario = useAuth((state) => state.usuario)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    if (!usuario) return
    let cancelado = false
    estaGuardado(usuario.uid, parseada.libro.referencia, parseada.capitulo, parseada.versiculo).then(
      (existe) => {
        if (!cancelado) setGuardado(existe)
      },
    )
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  async function manejarGuardar() {
    if (!usuario) return
    await alternarGuardado(
      usuario.uid,
      bibliaId,
      parseada.libro.referencia,
      parseada.capitulo,
      parseada.versiculo,
      resultado.vistaPrevia,
    )
    setGuardado((actual) => !actual)
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => onIrAVersiculo(parseada.libro, parseada.capitulo, parseada.versiculo)}
        className="flex-1 text-left"
      >
        <p className="mb-1 text-sm font-semibold text-talenta-gold">
          {nombreLibroLocalizado(parseada.libro, idioma)} {parseada.capitulo}:{parseada.versiculo}
        </p>
        <p className="text-base text-talenta-black">{resultado.vistaPrevia}</p>
      </button>

      <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={manejarGuardar}
          aria-label="Guardar versículo"
          className="text-talenta-brown-mid transition-colors hover:text-talenta-gold"
        >
          <Bookmark className="h-4 w-4" fill={guardado ? 'currentColor' : 'none'} />
        </button>
        <ChevronRight className="h-4 w-4 text-talenta-brown-mid/60" />
      </div>
    </div>
  )
}

export function BuscadorBiblia({ onIrAVersiculo }: BuscadorBibliaProps) {
  const usuario = useAuth((state) => state.usuario)
  const bibliaId = usuario?.versionBiblia ?? 'RVR60'
  const idioma = obtenerIdiomaDeBiblia(bibliaId)

  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState<ResultadoValido[] | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function manejarBusqueda(e: FormEvent) {
    e.preventDefault()
    if (!consulta.trim()) return

    setBuscando(true)
    setError(null)
    try {
      const datos = await buscarPalabra(bibliaId, consulta.trim())
      // Descarta resultados que no son un versículo real (ej. títulos de Salmos,
      // que el API a veces devuelve como "Psalm 100:title").
      const validos = datos.flatMap((resultado) => {
        const parseada = parsearReferencia(resultado.referencia)
        return parseada ? [{ resultado, parseada }] : []
      })
      setResultados(validos)
    } catch (err) {
      setError(err instanceof BibliaApiError ? err.message : 'No se pudo buscar. Intenta de nuevo.')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={manejarBusqueda} className="flex gap-2">
        <Input
          placeholder="Busca una palabra o frase…"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
        />
        <Button type="submit" disabled={buscando} className="shrink-0 px-4">
          <Search className="h-5 w-5" />
        </Button>
      </form>

      {buscando && <p className="text-center text-base text-talenta-brown-mid">Buscando…</p>}
      {error && <p className="text-center text-base text-red-700">{error}</p>}

      {resultados && resultados.length === 0 && !buscando && (
        <p className="text-center text-base text-talenta-brown-mid">
          Sin resultados para "{consulta}".
        </p>
      )}

      <div className="flex flex-col gap-3">
        {resultados?.map(({ resultado, parseada }, indice) => (
          <ResultadoBusquedaItem
            key={`${resultado.referencia}-${indice}`}
            resultado={resultado}
            parseada={parseada}
            bibliaId={bibliaId}
            idioma={idioma}
            onIrAVersiculo={onIrAVersiculo}
          />
        ))}
      </div>
    </div>
  )
}
