import { create } from 'zustand'
import { db } from '@/shared/lib/db'
import type { LoginInput, NuevoUsuarioInput, UserProfile } from '@/shared/types/user'
import { AuthError, iniciarSesion, registrarUsuario } from '../lib/authService'
import { guardarUidRecordado, limpiarUidRecordado, obtenerUidRecordado } from '../lib/session'

interface AuthState {
  usuario: UserProfile | null
  loading: boolean
  restaurandoSesion: boolean
  error: string | null
  registrar: (input: NuevoUsuarioInput) => Promise<void>
  login: (input: LoginInput, recordar: boolean) => Promise<void>
  logout: () => void
  limpiarError: () => void
  restaurarSesion: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  usuario: null,
  loading: false,
  restaurandoSesion: true,
  error: null,

  registrar: async (input) => {
    set({ loading: true, error: null })
    try {
      const usuario = await registrarUsuario(input)
      set({ usuario, loading: false })
    } catch (err) {
      const mensaje = err instanceof AuthError ? err.message : 'No se pudo crear la cuenta.'
      set({ error: mensaje, loading: false })
      throw err
    }
  },

  login: async (input, recordar) => {
    set({ loading: true, error: null })
    try {
      const usuario = await iniciarSesion(input)
      if (recordar) {
        guardarUidRecordado(usuario.uid)
      } else {
        limpiarUidRecordado()
      }
      set({ usuario, loading: false })
    } catch (err) {
      const mensaje = err instanceof AuthError ? err.message : 'No se pudo iniciar sesión.'
      set({ error: mensaje, loading: false })
      throw err
    }
  },

  logout: () => {
    limpiarUidRecordado()
    set({ usuario: null })
  },

  limpiarError: () => set({ error: null }),

  restaurarSesion: async () => {
    const uid = obtenerUidRecordado()
    if (!uid) {
      set({ restaurandoSesion: false })
      return
    }

    const usuario = await db.users.get(uid)
    if (!usuario) {
      limpiarUidRecordado()
      set({ restaurandoSesion: false })
      return
    }

    set({ usuario, restaurandoSesion: false })
  },
}))
