import { BookOpen } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function CourseHome() {
  return (
    <ModuleScreen icon={BookOpen} label="el Curso" durationMs={1000}>
      <ModulePlaceholder
        icon={BookOpen}
        titulo="Curso"
        descripcion="Tus 3 módulos y 8 lecciones estarán disponibles aquí muy pronto."
      />
    </ModuleScreen>
  )
}
