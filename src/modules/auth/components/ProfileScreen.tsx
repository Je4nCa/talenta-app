import { motion } from 'framer-motion'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '../hooks/useAuth'

function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfileScreen() {
  const usuario = useAuth((state) => state.usuario)
  const logout = useAuth((state) => state.logout)

  if (!usuario) return null

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-10 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-talenta-gold text-3xl font-semibold text-talenta-white shadow-lg">
        {iniciales(usuario.nombre)}
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-talenta-black">{usuario.nombre}</h1>
        <p className="mt-1 text-base text-talenta-brown-mid">{usuario.email}</p>
      </div>

      {usuario.rol === 'admin' && (
        <span className="flex items-center gap-2 rounded-full bg-talenta-gold/15 px-4 py-1.5 text-sm font-medium text-talenta-brown-dark">
          <ShieldCheck className="h-4 w-4" />
          Administrador
        </span>
      )}

      <div className="mt-4 w-full rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
        <dl className="flex flex-col gap-3 text-base">
          <div className="flex items-center justify-between">
            <dt className="text-talenta-brown-mid">Idioma</dt>
            <dd className="font-medium text-talenta-black">Español</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-talenta-brown-mid">Versión de Biblia</dt>
            <dd className="font-medium text-talenta-black">{usuario.versionBiblia}</dd>
          </div>
        </dl>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="mt-4 w-full gap-2"
        onClick={() => logout()}
      >
        <LogOut className="h-5 w-5" />
        Cerrar sesión
      </Button>
    </motion.div>
  )
}
