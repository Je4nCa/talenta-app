import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ModuleScreen } from '@/shared/components/ModuleScreen'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { BuzonFeedback } from './BuzonFeedback'
import { GestionCorreos } from './GestionCorreos'
import { RosterUsuarios } from './RosterUsuarios'

export function AdminHome() {
  const usuario = useAuth((state) => state.usuario)

  return (
    <ModuleScreen icon={ShieldCheck} label="Administración" durationMs={1000}>
      <motion.div
        className="mx-auto flex max-w-md flex-col gap-5 px-5 pb-10 pt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-talenta-gold" />
          <h1 className="text-2xl font-semibold text-talenta-black">Administración</h1>
        </div>

        <Tabs defaultValue="correos">
          <TabsList>
            <TabsTrigger value="correos">Correos</TabsTrigger>
            <TabsTrigger value="roster">Registrados</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="correos">
            <GestionCorreos emailAdmin={usuario?.email ?? ''} />
          </TabsContent>
          <TabsContent value="roster">
            <RosterUsuarios />
          </TabsContent>
          <TabsContent value="feedback">
            <BuzonFeedback />
          </TabsContent>
        </Tabs>
      </motion.div>
    </ModuleScreen>
  )
}
