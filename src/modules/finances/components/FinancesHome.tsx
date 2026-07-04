import { Wallet } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'
import { buscarPais } from '@/shared/lib/paises'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function FinancesHome() {
  const usuario = useAuth((state) => state.usuario)
  const pais = usuario ? buscarPais(usuario.paisCodigo) : undefined

  const descripcion = pais
    ? `Estamos adaptando el módulo completo de finanzas a TALENTA. Trabajarás en ${pais.monedaNombre} (${pais.monedaSimbolo} ${pais.monedaCodigo}), según tu país.`
    : 'Estamos adaptando el módulo completo de finanzas a TALENTA. Muy pronto verás tu presupuesto, gastos y balances aquí.'

  return (
    <ModuleScreen icon={Wallet} label="Finanzas" durationMs={1300}>
      <ModulePlaceholder icon={Wallet} titulo="Finanzas Esencial" descripcion={descripcion} />
    </ModuleScreen>
  )
}
