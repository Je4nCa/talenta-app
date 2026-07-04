import { motion } from 'framer-motion'
import { BookHeart } from 'lucide-react'
import { useVersiculoDelDia } from '../hooks/useVersiculoDelDia'

export function VersiculoDelDia() {
  const { referencia, texto, cargando, error } = useVersiculoDelDia()

  if (error) return null

  return (
    <motion.div
      className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="mb-2 flex items-center gap-2 text-talenta-gold">
        <BookHeart className="h-4 w-4" />
        <span className="text-sm font-medium">Versículo del día</span>
      </div>

      {cargando ? (
        <div className="h-14 animate-pulse rounded-lg bg-talenta-tan/30" />
      ) : (
        <>
          <p className="font-decorative text-xl italic leading-relaxed text-talenta-black">
            "{texto}"
          </p>
          <p className="mt-2 text-sm font-medium text-talenta-brown-mid">{referencia}</p>
        </>
      )}
    </motion.div>
  )
}
