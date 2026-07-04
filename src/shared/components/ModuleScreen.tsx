import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ModuleSplash } from './ModuleSplash'

interface ModuleScreenProps {
  icon: LucideIcon
  label: string
  durationMs?: number
  children: ReactNode
}

export function ModuleScreen({ icon, label, durationMs = 1100, children }: ModuleScreenProps) {
  const [listo, setListo] = useState(false)

  useEffect(() => {
    setListo(false)
    const temporizador = setTimeout(() => setListo(true), durationMs)
    return () => clearTimeout(temporizador)
  }, [durationMs])

  return (
    <AnimatePresence mode="wait">
      {!listo ? (
        <ModuleSplash key="splash" icon={icon} label={label} durationMs={durationMs} />
      ) : (
        <motion.div
          key="contenido"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
