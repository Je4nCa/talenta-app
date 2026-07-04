import { Select } from '@/shared/components/ui/select'
import { LIBROS_BIBLIA, type LibroBiblia } from '../constants/libros'

interface SelectorLibroCapituloProps {
  libro: LibroBiblia
  capitulo: number
  onCambiarLibro: (libro: LibroBiblia) => void
  onCambiarCapitulo: (capitulo: number) => void
}

export function SelectorLibroCapitulo({
  libro,
  capitulo,
  onCambiarLibro,
  onCambiarCapitulo,
}: SelectorLibroCapituloProps) {
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
          <optgroup label="Antiguo Testamento">
            {LIBROS_BIBLIA.filter((l) => l.testamento === 'antiguo').map((l) => (
              <option key={l.referencia} value={l.referencia}>
                {l.nombre}
              </option>
            ))}
          </optgroup>
          <optgroup label="Nuevo Testamento">
            {LIBROS_BIBLIA.filter((l) => l.testamento === 'nuevo').map((l) => (
              <option key={l.referencia} value={l.referencia}>
                {l.nombre}
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
              Cap. {n}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
