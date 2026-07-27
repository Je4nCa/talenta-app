import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { firebaseAuth, firestore } from '@/shared/lib/firebase'
import type { LoginInput, NuevoUsuarioInput, UserProfile } from '@/shared/types/user'
import {
  AuthError,
  actualizarMoneda,
  actualizarVersionBiblia,
  iniciarSesion,
  registrarUsuario,
} from '../lib/authService'

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
  cambiarVersionBiblia: (versionBiblia: string) => Promise<void>
  cambiarMoneda: (monedaCodigo: string) => Promise<void>
}

export const useAuth = create<AuthState>((set, get) => ({
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
      const detalle = err instanceof Error ? err.message : String(err)
      const mensaje = err instanceof AuthError ? err.message : `No se pudo crear la cuenta (${detalle}).`
      set({ error: mensaje, loading: false })
      throw err
    }
  },

  login: async (input, recordar) => {
    set({ loading: true, error: null })
    try {
      // Reemplaza el viejo "recordar uid en localStorage" — Firebase Auth ya
      // trae su propio mecanismo de persistencia de sesión entre pestañas.
      await setPersistence(firebaseAuth, recordar ? browserLocalPersistence : browserSessionPersistence)
      const usuario = await iniciarSesion(input)
      set({ usuario, loading: false })
    } catch (err) {
      const mensaje = err instanceof AuthError ? err.message : 'No se pudo iniciar sesión.'
      set({ error: mensaje, loading: false })
      throw err
    }
  },

  logout: () => {
    void signOut(firebaseAuth)
    set({ usuario: null })
  },

  limpiarError: () => set({ error: null }),

  restaurarSesion: () => {
    return new Promise<void>((resolve) => {
      let primeraVez = true
      onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (!fbUser) {
          set({ usuario: null, restaurandoSesion: false })
        } else {
          try {
            const snap = await getDoc(doc(firestore, 'users', fbUser.uid))
            set({ usuario: snap.exists() ? (snap.data() as UserProfile) : null, restaurandoSesion: false })
          } catch {
            set({ usuario: null, restaurandoSesion: false })
          }
        }
        if (primeraVez) {
          primeraVez = false
          resolve()
        }
      })
    })
  },

  cambiarVersionBiblia: async (versionBiblia) => {
    const usuarioActual = get().usuario
    if (!usuarioActual) return
    await actualizarVersionBiblia(usuarioActual.uid, versionBiblia)
    set({ usuario: { ...usuarioActual, versionBiblia } })
  },

  cambiarMoneda: async (monedaCodigo) => {
    const usuarioActual = get().usuario
    if (!usuarioActual) return
    await actualizarMoneda(usuarioActual.uid, monedaCodigo)
    set({ usuario: { ...usuarioActual, monedaCodigo } })
  },
}))
