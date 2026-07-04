import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AuthScreen } from '@/modules/auth/components/AuthScreen'
import { SplashScreen } from '@/modules/auth/components/SplashScreen'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const DURACION_MINIMA_SPLASH_MS = 2200

function App() {
  const usuario = useAuth((state) => state.usuario)
  const restaurandoSesion = useAuth((state) => state.restaurandoSesion)
  const restaurarSesion = useAuth((state) => state.restaurarSesion)
  const [tiempoMinimoCumplido, setTiempoMinimoCumplido] = useState(false)

  useEffect(() => {
    restaurarSesion()
    const temporizador = setTimeout(() => setTiempoMinimoCumplido(true), DURACION_MINIMA_SPLASH_MS)
    return () => clearTimeout(temporizador)
  }, [restaurarSesion])

  const mostrarSplash = restaurandoSesion || !tiempoMinimoCumplido

  return (
    <AnimatePresence mode="wait">
      {mostrarSplash ? (
        <SplashScreen key="splash" />
      ) : usuario ? (
        <div
          key="bienvenida"
          className="flex min-h-dvh items-center justify-center bg-talenta-cream px-4 text-center"
        >
          <div>
            <h1 className="text-2xl font-semibold text-talenta-black sm:text-3xl">
              ¡Bienvenido, {usuario.nombre}!
            </h1>
            <p className="mt-2 text-base text-talenta-brown-dark">
              El curso, la Biblia y tus finanzas están por venir.
            </p>
          </div>
        </div>
      ) : (
        <AuthScreen key="auth" />
      )}
    </AnimatePresence>
  )
}

export default App
