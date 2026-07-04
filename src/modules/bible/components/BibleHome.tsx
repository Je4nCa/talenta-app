import { BookHeart } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { ModulePlaceholder } from '@/shared/components/ModulePlaceholder'

export function BibleHome() {
  return (
    <ModuleScreen icon={BookHeart} label="la Biblia" durationMs={1000}>
      <ModulePlaceholder
        icon={BookHeart}
        titulo="Biblia"
        descripcion="El versículo diario y la memorización progresiva llegarán muy pronto a esta sección."
      />
    </ModuleScreen>
  )
}
