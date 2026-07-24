import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, MessageSquareHeart } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { sanitizarTextoLibre, sanitizarValorPlano } from '@/shared/lib/sanitize'

const MENSAJE_LARGO_MAXIMO = 2000

interface FeedbackFormProps {
  nombre: string
  email: string
}

export function FeedbackForm({ nombre, email }: FeedbackFormProps) {
  const [abierto, setAbierto] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function manejarEnviar(e: FormEvent) {
    e.preventDefault()
    if (!mensaje.trim()) return

    setEnviando(true)
    setError(null)
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          // Todos los valores pasan por un sanitizador antes de salir —
          // ninguno se interpola directamente. nombre_usuario y mensaje se
          // insertan en el HTML del cuerpo de la plantilla de EmailJS y se
          // escapan por completo (evita que alguien inyecte etiquetas,
          // scripts o enlaces ocultos en el correo que reciben Carlos y
          // Alicia). email_usuario lo usa EmailJS como cabecera "Reply To"
          // — no se escapa como HTML (lo corrompería), pero sí se limpia de
          // saltos de línea/caracteres de control para prevenir inyección
          // de cabeceras de correo. fecha la genera el propio código (no es
          // texto de usuario) pero se sanitiza igual, por consistencia.
          nombre_usuario: sanitizarTextoLibre(nombre, 200),
          email_usuario: sanitizarValorPlano(email, 254),
          mensaje: sanitizarTextoLibre(mensaje, MENSAJE_LARGO_MAXIMO),
          fecha: sanitizarValorPlano(
            new Date().toLocaleString('es', { dateStyle: 'long', timeStyle: 'short' }),
            100,
          ),
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      )
      setEnviado(true)
      setMensaje('')
    } catch {
      setError('No se pudo enviar tu feedback. Intenta de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-center shadow-sm">
        <CheckCircle2 className="h-8 w-8 text-talenta-gold" />
        <p className="text-base font-medium text-talenta-black">¡Gracias por tu feedback!</p>
        <p className="text-sm text-talenta-brown-mid">Carlos y Alicia lo van a leer pronto.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {abierto ? (
          <motion.form
            key="form"
            onSubmit={manejarEnviar}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm"
          >
            <Label htmlFor="feedback-mensaje">Cuéntanos qué piensas de TALENTA</Label>
            <Textarea
              id="feedback-mensaje"
              placeholder="Ideas, errores, o lo que quieras compartir…"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              maxLength={MENSAJE_LARGO_MAXIMO}
              required
            />
            <p className="text-sm text-talenta-brown-mid">
              Se enviará junto a tu nombre ({nombre}) y correo ({email}).
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="mt-1 flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setAbierto(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="lg" className="flex-1" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar'}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div key="boton">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2"
              onClick={() => setAbierto(true)}
            >
              <MessageSquareHeart className="h-5 w-5" />
              Enviar feedback
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
