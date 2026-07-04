import { Select } from '@/shared/components/ui/select'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { BIBLIAS_DISPONIBLES, BIBLIA_POR_DEFECTO } from '../constants/biblias'

export function SelectorBiblia() {
  const usuario = useAuth((state) => state.usuario)
  const cambiarVersionBiblia = useAuth((state) => state.cambiarVersionBiblia)

  const versionActual = usuario?.versionBiblia ?? BIBLIA_POR_DEFECTO

  return (
    <Select
      aria-label="Versión de la Biblia"
      value={versionActual}
      onChange={(e) => cambiarVersionBiblia(e.target.value)}
    >
      {BIBLIAS_DISPONIBLES.map((biblia) => (
        <option key={biblia.id} value={biblia.id}>
          {biblia.titulo} ({biblia.idioma})
        </option>
      ))}
    </Select>
  )
}
