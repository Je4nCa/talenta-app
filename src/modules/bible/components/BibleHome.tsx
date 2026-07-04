import { BookHeart } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { SelectorBiblia } from './SelectorBiblia'
import { LectorCapitulo } from './LectorCapitulo'
import { BuscadorBiblia } from './BuscadorBiblia'
import { VersiculosGuardadosList } from './VersiculosGuardadosList'

export function BibleHome() {
  return (
    <ModuleScreen icon={BookHeart} label="la Biblia" durationMs={1000}>
      <div className="mx-auto flex max-w-md flex-col gap-5 px-5 pb-10 pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-talenta-black">Biblia</h1>
          <div className="mt-3">
            <SelectorBiblia />
          </div>
        </div>

        <Tabs defaultValue="leer">
          <TabsList>
            <TabsTrigger value="leer">Leer</TabsTrigger>
            <TabsTrigger value="buscar">Buscar</TabsTrigger>
            <TabsTrigger value="guardados">Guardados</TabsTrigger>
          </TabsList>
          <TabsContent value="leer">
            <LectorCapitulo />
          </TabsContent>
          <TabsContent value="buscar">
            <BuscadorBiblia />
          </TabsContent>
          <TabsContent value="guardados">
            <VersiculosGuardadosList />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleScreen>
  )
}
