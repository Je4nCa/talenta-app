import { Select } from '@/shared/components/ui/select'
import { LIBROS_BIBLIA, type LibroBiblia } from '../constants/libros'
import { ETIQUETA_CAPITULO_POR_IDIOMA, TESTAMENTOS_POR_IDIOMA } from '../constants/nombresLibrosPorIdioma'
import { nombreLibroLocalizado } from '../lib/referencias'

interface SelectorLibroCapituloProps {
  libro: LibroBiblia
  capitulo: number
  idioma: string
  onCambiarLibro: (libro: LibroBiblia) => void
  onCambiarCapitulo: (capitulo: number) => void
}

export function SelectorLibroCapitulo({
  libro,
  capitulo,
  idioma,
  onCambiarLibro,
  onCambiarCapitulo,
}: SelectorLibroCapituloProps) {
  const testamentos = TESTAMENTOS_POR_IDIOMA[idioma] ?? TESTAMENTOS_POR_IDIOMA.Español
  const etiquetaCapitulo = ETIQUETA_CAPITULO_POR_IDIOMA[idioma] ?? 'Cap.'

  return (
    <div className="flex gap-3">
      <div className="flex-[2]">
        <Select
          aria-label="Libro"
          value={libro.referencia}
          onChange={(e) => {
            const nuevoLibro = LIBROS_BIBLIA.find((l) => l.referencia === e.target.value)
            if (nuevoLibro) onCambiarLibro(nuevoLibro)
          }}
        >
          <optgroup label={testamentos.antiguo}>
            {LIBROS_BIBLIA.filter((l) => l.testamento === 'antiguo').map((l) => (
              <option key={l.referencia} value={l.referencia}>
                {nombreLibroLocalizado(l, idioma)}
              </option>
            ))}
          </optgroup>
          <optgroup label={testamentos.nuevo}>
            {LIBROS_BIBLIA.filter((l) => l.testamento === 'nuevo').map((l) => (
              <option key={l.referencia} value={l.referencia}>
                {nombreLibroLocalizado(l, idioma)}
              </option>
            ))}
          </optgroup>
        </Select>
      </div>

      <div className="flex-1">
        <Select
          aria-label="Capítulo"
          value={capitulo}
          onChange={(e) => onCambiarCapitulo(Number(e.target.value))}
        >
          {Array.from({ length: libro.capitulos }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {etiquetaCapitulo} {n}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
