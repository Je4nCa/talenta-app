import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface ModuleSplashProps {
  icon: LucideIcon
  label: string
  durationMs: number
}

export function ModuleSplash({ icon: Icon, label, durationMs }: ModuleSplashProps) {
  const durationS = durationMs / 1000

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-talenta-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-talenta-tan"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-talenta-gold"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: durationS, ease: 'easeInOut' }}
          />
        </svg>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-talenta-gold/15 text-talenta-gold"
        >
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </motion.div>
      </div>

      <motion.p
        className="text-lg font-medium text-talenta-brown-dark"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Entrando a {label}…
      </motion.p>
    </motion.div>
  )
}
