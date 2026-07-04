import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { BibliaApiError, buscarPalabra } from '../lib/bibliaClient'
import type { ResultadoBusqueda } from '../types'

export function BuscadorBiblia() {
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
          <div
            key={`${r.referencia}-${indice}`}
            className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-4 shadow-sm"
          >
            <p className="mb-1 text-sm font-semibold text-talenta-gold">{r.referencia}</p>
            <p className="text-base text-talenta-black">{r.vistaPrevia}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
