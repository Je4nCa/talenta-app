import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { firestore } from '@/shared/lib/firebase'
import type { CorreoAutorizado } from '../types/correoAutorizado'

/**
 * Lista reactiva de correos autorizados. Solo la puede leer un superadmin
 * (ver `firestore.rules`); si las reglas la rechazan, se expone el error en
 * vez de dejar la pantalla cargando para siempre.
 *
 * Cada correo puede tener dos documentos (su forma literal y la canónica de
 * Gmail); aquí se muestran deduplicados por correo, que es lo que el admin
 * espera ver.
 */
export function useCorreosAutorizados() {
  const [correos, setCorreos] = useState<CorreoAutorizado[] | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(firestore, 'correosAutorizados'),
      (snap) => {
        const porEmail = new Map<string, CorreoAutorizado>()
        for (const d of snap.docs) {
          const dato = d.data() as CorreoAutorizado
          if (!porEmail.has(dato.email)) porEmail.set(dato.email, dato)
        }
        setCorreos([...porEmail.values()].sort((a, b) => a.email.localeCompare(b.email)))
        setError(null)
      },
      () => {
        setCorreos([])
        setError('No se pudo cargar la lista. Revisa que tu cuenta sea de administrador.')
      },
    )
    return unsub
  }, [])

  return { correos: correos ?? [], cargando: correos === undefined, error }
}
