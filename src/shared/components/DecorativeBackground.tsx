import { motion } from 'framer-motion'

export function DecorativeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-talenta-gold/20 blur-3xl sm:h-96 sm:w-96"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-talenta-brown-mid/20 blur-3xl sm:h-[26rem] sm:w-[26rem]"
        animate={{ y: [0, -24, 0], x: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-8 top-16 h-3 w-3 rounded-full bg-talenta-gold/60"
        animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-10 top-1/3 h-2 w-2 rounded-full bg-talenta-brown-mid/60"
        animate={{ y: [0, 16, 0], opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      <motion.div
        className="absolute bottom-24 left-1/4 h-2.5 w-2.5 rounded-full bg-talenta-gold/50"
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      />
    </div>
  )
}
