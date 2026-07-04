import { create } from 'zustand'

const CLAVE_ESCALA = 'talenta:escala-interfaz'
const TAMANO_BASE_PX = 16
export const ESCALA_MINIMA = 1
export const ESCALA_MAXIMA = 1.5

function leerEscalaGuardada(): number {
  const guardada = Number(localStorage.getItem(CLAVE_ESCALA))
  return guardada >= ESCALA_MINIMA && guardada <= ESCALA_MAXIMA ? guardada : ESCALA_MINIMA
}

function aplicarEscala(escala: number): void {
  document.documentElement.style.fontSize = `${TAMANO_BASE_PX * escala}px`
}

interface AccesibilidadState {
  escala: number
  setEscala: (escala: number) => void
}

export const useAccesibilidad = create<AccesibilidadState>((set) => ({
  escala: leerEscalaGuardada(),
  setEscala: (escala) => {
    localStorage.setItem(CLAVE_ESCALA, String(escala))
    aplicarEscala(escala)
    set({ escala })
  },
}))

aplicarEscala(leerEscalaGuardada())
