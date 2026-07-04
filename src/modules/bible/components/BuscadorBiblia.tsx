import { useEffect, useState, type FormEvent } from 'react'
import { Bookmark, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { BibliaApiError, buscarPalabra } from '../lib/bibliaClient'
import { parsearReferencia } from '../lib/referencias'
import { alternarGuardado, estaGuardado } from '../hooks/useMarcadores'
import type { LibroBiblia } from '../constants/libros'
import type { ResultadoBusqueda } from '../types'

interface BuscadorBibliaProps {
  onIrAVersiculo: (libro: LibroBiblia, capitulo: number, versiculo: number) => void
}

function ResultadoBusquedaItem({
  resultado,
  bibliaId,
  onIrAVersiculo,
}: {
  resultado: ResultadoBusqueda
  bibliaId: string
  onIrAVersiculo: (libro: LibroBiblia, capitulo: number, versiculo: number) => void
}) {
  const usuario = useAuth((state) => state.usuario)
  const [guardado, setGuardado] = useState(false)
  const parseada = parsearReferencia(resultado.referencia)

  useEffect(() => {
    if (!usuario || !parseada) return
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
  }, [usuario, resultado.referencia])

  async function manejarGuardar() {
    if (!usuario || !parseada) return
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

  const referenciaMostrada = parseada
    ? `${parseada.libro.nombre} ${parseada.capitulo}:${parseada.versiculo}`
    : resultado.referencia

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        disabled={!parseada}
        onClick={() =>
          parseada && onIrAVersiculo(parseada.libro, parseada.capitulo, parseada.versiculo)
        }
        className="flex-1 text-left disabled:cursor-default"
      >
        <p className="mb-1 text-sm font-semibold text-talenta-gold">{referenciaMostrada}</p>
        <p className="text-base text-talenta-black">{resultado.vistaPrevia}</p>
      </button>

      {parseada && (
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
      )}
    </div>
  )
}

export function BuscadorBiblia({ onIrAVersiculo }: BuscadorBibliaProps) {
  const usuario = useAuth((state) => state.usuario)
  const bibliaId = usuario?.versionBiblia ?? 'RVR60'

  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState<ResultadoBusqueda[] | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function manejarBusqueda(e: FormEvent) {
    e.preventDefault()
    if (!consulta.trim()) return

    setBuscando(true)
    setError(null)
    try {
      const datos = await buscarPalabra(bibliaId, consulta.trim())
      setResultados(datos)
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
        {resultados?.map((r, indice) => (
          <ResultadoBusquedaItem
            key={`${r.referencia}-${indice}`}
            resultado={r}
            bibliaId={bibliaId}
            onIrAVersiculo={onIrAVersiculo}
          />
        ))}
      </div>
    </div>
  )
}
