import { motion } from 'framer-motion'
import { LogoMark } from './LogoMark'

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-talenta-black"
      exit={{
        opacity: 0,
        scale: 1.15,
        transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
      }}
    >
      <motion.div
        className="w-48 text-talenta-gold sm:w-56"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{
          opacity: 1,
          scale: [0.55, 1.06, 1],
        }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <LogoMark />
      </motion.div>

      <motion.div
        className="absolute h-56 w-56 rounded-full border border-talenta-gold/30 sm:h-72 sm:w-72"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.4, 1.7] }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
      />
    </motion.div>
  )
}
