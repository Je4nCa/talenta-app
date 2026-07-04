import { useState } from 'react'
import { BookHeart } from 'lucide-react'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { LIBROS_BIBLIA, type LibroBiblia } from '../constants/libros'
import { SelectorBiblia } from './SelectorBiblia'
import { LectorCapitulo } from './LectorCapitulo'
import { BuscadorBiblia } from './BuscadorBiblia'
import { VersiculosGuardadosList } from './VersiculosGuardadosList'

export function BibleHome() {
  const [tabActiva, setTabActiva] = useState('leer')
  const [libro, setLibro] = useState<LibroBiblia>(LIBROS_BIBLIA[42]) // Juan, por defecto
  const [capitulo, setCapitulo] = useState(3)
  const [versiculoDestino, setVersiculoDestino] = useState<number | undefined>(undefined)

  function irAVersiculo(libroDestino: LibroBiblia, capituloDestino: number, versiculo: number) {
    setLibro(libroDestino)
    setCapitulo(capituloDestino)
    setVersiculoDestino(versiculo)
    setTabActiva('leer')
  }

  return (
    <ModuleScreen icon={BookHeart} label="la Biblia" durationMs={1000}>
      <div className="mx-auto flex max-w-md flex-col gap-5 px-5 pb-10 pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-talenta-black">Biblia</h1>
          <div className="mt-3">
            <SelectorBiblia />
          </div>
        </div>

        <Tabs value={tabActiva} onValueChange={setTabActiva}>
          <TabsList>
            <TabsTrigger value="leer">Leer</TabsTrigger>
            <TabsTrigger value="buscar">Buscar</TabsTrigger>
            <TabsTrigger value="guardados">Guardados</TabsTrigger>
          </TabsList>
          <TabsContent value="leer">
            <LectorCapitulo
              libro={libro}
              capitulo={capitulo}
              versiculoDestino={versiculoDestino}
              onCambiarLibro={(nuevoLibro) => {
                setVersiculoDestino(undefined)
                setLibro(nuevoLibro)
              }}
              onCambiarCapitulo={(nuevoCapitulo) => {
                setVersiculoDestino(undefined)
                setCapitulo(nuevoCapitulo)
              }}
            />
          </TabsContent>
          <TabsContent value="buscar">
            <BuscadorBiblia onIrAVersiculo={irAVersiculo} />
          </TabsContent>
          <TabsContent value="guardados">
            <VersiculosGuardadosList />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleScreen>
  )
}
