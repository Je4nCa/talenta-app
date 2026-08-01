import { useEffect, useState, type FormEvent } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, Mail, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { firestore } from '@/shared/lib/firebase'
import { canonizarEmail } from '@/shared/lib/email'
import type { UserProfile } from '@/shared/types/user'
import { useCorreosAutorizados } from '../hooks/useCorreosAutorizados'
import {
  autorizarCorreo,
  quitarCorreoAutorizado,
} from '../repositories/correosAutorizados.repository'

/** Correos que ya crearon su cuenta, para marcar quién falta por entrar. */
function useCorreosRegistrados() {
  const [correos, setCorreos] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsub = onSnapshot(
      collection(firestore, 'users'),
      (snap) => {
        setCorreos(
          new Set(snap.docs.map((d) => canonizarEmail((d.data() as UserProfile).email ?? ''))),
        )
      },
      () => setCorreos(new Set()),
    )
    return unsub
  }, [])

  return correos
}

export function GestionCorreos({ emailAdmin }: { emailAdmin: string }) {
  const { correos, cargando, error } = useCorreosAutorizados()
  const registrados = useCorreosRegistrados()
  const [nuevo, setNuevo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)

  async function manejarAgregar(e: FormEvent) {
    e.preventDefault()
    const email = nuevo.trim()
    if (!email) return
    if (!email.includes('@') || !email.includes('.')) {
      setErrorForm('Escribe un correo válido.')
      return
    }

    setGuardando(true)
    setErrorForm(null)
    setMensaje(null)
    try {
      await autorizarCorreo(email, emailAdmin)
      setMensaje(`${email} ya puede crear su cuenta.`)
      setNuevo('')
    } catch (err) {
      setErrorForm(
        err instanceof Error ? err.message : 'No se pudo autorizar el correo. Intenta de nuevo.',
      )
    } finally {
      setGuardando(false)
    }
  }

  async function manejarQuitar(email: string) {
    setErrorForm(null)
    setMensaje(null)
    try {
      await quitarCorreoAutorizado(email)
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : 'No se pudo quitar el correo.')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={manejarAgregar}
        className="flex flex-col gap-3 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 shadow-sm"
      >
        <Label htmlFor="admin-nuevo-correo">Autorizar un correo nuevo</Label>
        <Input
          id="admin-nuevo-correo"
          type="email"
          placeholder="estudiante@ejemplo.com"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
        />
        <p className="text-sm text-talenta-brown-mid">
          Con esto la persona ya puede crear su cuenta usando el código del curso. El cambio es
          inmediato, no hay que esperar una actualización de la app.
        </p>

        {errorForm && (
          <p role="alert" className="text-base font-medium text-red-700">
            {errorForm}
          </p>
        )}
        {mensaje && <p className="text-base font-medium text-green-700">{mensaje}</p>}

        <Button type="submit" size="lg" className="mt-1 gap-2" disabled={guardando}>
          <Plus className="h-5 w-5" />
          {guardando ? 'Autorizando…' : 'Autorizar'}
        </Button>
      </form>

      <div>
        <div className="mb-3 flex items-center gap-2 text-talenta-black">
          <Mail className="h-4 w-4 text-talenta-gold" />
          <span className="text-base font-medium">
            Correos autorizados desde el panel ({correos.length})
          </span>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-700">
            {error}
          </p>
        )}

        {cargando ? (
          <p className="py-6 text-center text-base text-talenta-brown-mid">Cargando…</p>
        ) : correos.length === 0 && !error ? (
          <p className="rounded-xl bg-talenta-cream/60 px-4 py-4 text-base text-talenta-brown-mid">
            Todavía no has autorizado ningún correo desde aquí. Los estudiantes de la lista
            original del curso ya pueden entrar sin aparecer en esta lista.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {correos.map((c) => {
                const yaEntro = registrados.has(canonizarEmail(c.email))
                return (
                  <motion.div
                    key={c.email}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 overflow-hidden rounded-xl border border-talenta-tan/60 bg-talenta-white/90 px-4 py-3"
                  >
                    {yaEntro ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-talenta-brown-mid/50" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base text-talenta-black">{c.email}</p>
                      <p className="text-sm text-talenta-brown-mid">
                        {yaEntro ? 'Ya creó su cuenta' : 'Aún no ha creado su cuenta'}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Quitar ${c.email}`}
                      onClick={() => manejarQuitar(c.email)}
                      className="shrink-0 text-talenta-brown-mid transition-colors hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
