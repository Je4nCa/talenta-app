import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function VisorFactura({ imagen }: { imagen: Blob }) {
  const [abierto, setAbierto] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(imagen)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imagen])

  if (!url) return null

  return (
    <>
      <button
        type="button"
        aria-label="Ver factura"
        onClick={() => setAbierto(true)}
        className="shrink-0"
      >
        <img
          src={url}
          alt="Factura"
          className="h-11 w-11 rounded-xl object-cover shadow-sm ring-1 ring-talenta-tan/60"
        />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-talenta-black/80 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAbierto(false)}
          >
            <motion.img
              src={url}
              alt="Factura"
              className="max-h-full max-w-full rounded-2xl shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setAbierto(false)}
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-talenta-white/90 text-talenta-black shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
