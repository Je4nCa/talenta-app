import { AuthScreen } from '@/modules/auth/components/AuthScreen'
import { useAuth } from '@/modules/auth/hooks/useAuth'

function App() {
  const usuario = useAuth((state) => state.usuario)

  if (!usuario) {
    return <AuthScreen />
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-talenta-cream px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-talenta-black sm:text-3xl">
          ¡Bienvenido, {usuario.nombre}!
        </h1>
        <p className="mt-2 text-base text-talenta-brown-dark">
          El curso, la Biblia y tus finanzas están por venir.
        </p>
      </div>
    </div>
  )
}

export default App
