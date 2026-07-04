import { create } from 'zustand'
import type { LoginInput, NuevoUsuarioInput, UserProfile } from '@/shared/types/user'
import { AuthError, iniciarSesion, registrarUsuario } from '../lib/authService'

interface AuthState {
  usuario: UserProfile | null
  loading: boolean
  error: string | null
  registrar: (input: NuevoUsuarioInput) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  logout: () => void
  limpiarError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  usuario: null,
  loading: false,
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

  login: async (input) => {
    set({ loading: true, error: null })
    try {
      const usuario = await iniciarSesion(input)
      set({ usuario, loading: false })
    } catch (err) {
      const mensaje = err instanceof AuthError ? err.message : 'No se pudo iniciar sesión.'
      set({ error: mensaje, loading: false })
      throw err
    }
  },

  logout: () => set({ usuario: null }),
  limpiarError: () => set({ error: null }),
}))
