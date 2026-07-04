import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HashRouter } from 'react-router-dom'
import { AuthScreen } from '@/modules/auth/components/AuthScreen'
import { SplashScreen } from '@/modules/auth/components/SplashScreen'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { AppRoutes } from '@/router/AppRoutes'

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
    <HashRouter>
      <AnimatePresence mode="wait">
        {mostrarSplash ? (
          <SplashScreen key="splash" />
        ) : usuario ? (
          <AppRoutes key="app" />
        ) : (
          <AuthScreen key="auth" />
        )}
      </AnimatePresence>
    </HashRouter>
  )
}

export default App
