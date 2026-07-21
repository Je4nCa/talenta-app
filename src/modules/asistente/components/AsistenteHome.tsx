import { Sparkles } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function AsistenteHome() {
  return (
    <ModuleScreen icon={Sparkles} label="el Asistente Financiero" durationMs={1000}>
      <ModulePlaceholder
        icon={Sparkles}
        titulo="Asistente Financiero"
        descripcion="Una IA que te ayudará a entender tus finanzas y tomar mejores decisiones, directo dentro de TALENTA. Muy pronto disponible."
      />
    </ModuleScreen>
  )
}
