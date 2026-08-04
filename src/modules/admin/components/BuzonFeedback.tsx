import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { AlertTriangle, Check, MessageSquareHeart } from 'lucide-react'
import { coleccionFeedback, marcarFeedbackLeido } from '../repositories/feedback.repository'
import type { Feedback } from '../types/feedback'

function useFeedback() {
  const [mensajes, setMensajes] = useState<Feedback[] | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(
      coleccionFeedback(),
      (snap) => {
        setMensajes(
          snap.docs
            .map((d) => d.data() as Feedback)
            .sort((a, b) => (b.creadoEn ?? '').localeCompare(a.creadoEn ?? '')),
        )
        setError(null)
      },
      () => {
        setMensajes([])
        setError('No se pudo cargar el buzón. Revisa que tu cuenta sea de administrador.')
      },
    )
    return unsub
  }, [])

  return { mensajes: mensajes ?? [], cargando: mensajes === undefined, error }
}

function formatearFecha(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es', { dateStyle: 'long', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export function BuzonFeedback() {
  const { mensajes, cargando, error } = useFeedback()
  const sinLeer = mensajes.filter((m) => !m.leido).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-talenta-black">
        <MessageSquareHeart className="h-4 w-4 text-talenta-gold" />
        <span className="text-base font-medium">
          {mensajes.length} {mensajes.length === 1 ? 'mensaje' : 'mensajes'}
          {sinLeer > 0 && ` · ${sinLeer} sin leer`}
        </span>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-700">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="py-6 text-center text-base text-talenta-brown-mid">Cargando…</p>
      ) : mensajes.length === 0 && !error ? (
        <p className="rounded-xl bg-talenta-cream/60 px-4 py-4 text-base text-talenta-brown-mid">
          Todavía nadie ha enviado feedback. Los mensajes enviados antes de hoy no aparecen aquí:
          hasta ahora solo se mandaban por correo, sin guardarse.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {mensajes.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-4 shadow-sm ${
                m.leido
                  ? 'border-talenta-tan/60 bg-talenta-white/70'
                  : 'border-talenta-gold/60 bg-talenta-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-talenta-black">{m.nombre}</p>
                  <p className="truncate text-sm text-talenta-brown-mid">{m.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => marcarFeedbackLeido(m.id, !m.leido)}
                  aria-label={m.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    m.leido
                      ? 'bg-talenta-tan/40 text-talenta-brown-mid'
                      : 'bg-talenta-gold/20 text-talenta-gold'
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-base text-talenta-black">{m.mensaje}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-talenta-brown-mid">
                <span>{formatearFecha(m.creadoEn)}</span>
                {!m.correoEnviado && (
                  <span className="flex items-center gap-1 text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    No salió el correo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
